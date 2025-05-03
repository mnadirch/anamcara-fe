import { createContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import AuthService from '../../api/services/AuthService';
import { UserProfile } from '../../types/auth';

const supabase = createClient('https://wppxoslslgwovvpyldjy.supabase.co',"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwcHhvc2xzbGd3b3Z2cHlsZGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMTczMDIsImV4cCI6MjA2MDc5MzMwMn0.60PIkRWanylc8vBcwOfKtggoyklqZOmrqeFOvUp_gZA");

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userProfile: UserProfile | null;
}


const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const fetchUserProfile = async () => {
    if (user) {
      try {
        const profile = await AuthService.getProfile(user.id);
        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
  };

  useEffect(() => {
    // Initial load
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) console.error('Error getting session:', error);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setUserProfile(await AuthService.getProfile(session.user.id));
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if(session?.user) {
        fetchUserProfile();
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [user]);
  return (
    <AuthContext.Provider value={{ user, session, loading, userProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthContext};