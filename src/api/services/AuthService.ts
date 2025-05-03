// lib/AuthService.ts
import { createClient } from '@supabase/supabase-js';
import { UserProfile } from '../../types/auth';
// import supabase  from '../supabase/client';


const supabase = createClient('https://wppxoslslgwovvpyldjy.supabase.co', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwcHhvc2xzbGd3b3Z2cHlsZGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMTczMDIsImV4cCI6MjA2MDc5MzMwMn0.60PIkRWanylc8vBcwOfKtggoyklqZOmrqeFOvUp_gZA");

class AuthService {
  
  // Sign up with email and password
  async signUp(email: string, password: string, firstName:string, lastName:string) {
    const redirectTo = `${window.location.origin}/membership`;
    const { data, error } = await supabase.auth.signUp({ email, password , options:{emailRedirectTo: redirectTo}});
    if (error) throw error;

    // Store additional user information in the profiles collection
    const user = data.user;
    if (user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        first_name: firstName,
        last_name: lastName,
        role: 'user',
      });
      if (profileError) throw profileError;
    }
    return user;
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) throw authError;

    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

    if (profileError) throw profileError;

    // Return both auth data and profile data
    return { user: authData.user, profile: profileData };
  }
  

  // Sign in with Google OAuth
  async signInWithGoogle() {
    const redirectTo = `${window.location.origin}/membership`;
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },

    })
  }

  // Sign out
  async signOut() {
    return await supabase.auth.signOut()
  }

  // Send password reset email
  async sendResetPasswordEmail(email: string) {
    return await supabase.auth.resetPasswordForEmail(email)
  }

  // Update password after reset (once redirected to app)
  async updatePassword(newPassword: string) {
    return await supabase.auth.updateUser({ password: newPassword })
  }

// Get user profile from profiles table
// Example of a solid getProfile
async getProfile(userId: string): Promise<UserProfile | null> {
    console.log('Calling getProfile for user ID:', userId);
  
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
  
    console.log('Profile response:', { data, error });
  
    if (error) {
      console.error('getProfile error:', error);
      throw error;
    }
  
    return data;
  }
  
  

  // Get current user
  async getUser() {
    return await supabase.auth.getUser()
  }

  // Subscribe to auth changes (optional)
  onAuthStateChange(callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

export default new AuthService()
