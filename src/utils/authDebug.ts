// src/utils/authDebug.ts
import supabase from '../api/supabase/client';

export async function debugAuthState() {
  console.log('=== AUTH DEBUGGING ===');
  
  // Check current session
  const { data: sessionData } = await supabase.auth.getSession();
  console.log('Current session:', sessionData);
  
  // Check current user
  const { data: userData } = await supabase.auth.getUser();
  console.log('Current user:', userData);
  
  if (userData.user) {
    // Check if user profile exists
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.user.id)
      .single();
      
    console.log('User profile:', profileData, profileError);
  }
  
  console.log('=== END AUTH DEBUGGING ===');
}

// Add this to your AuthProvider's useEffect
// debugAuthState();

// You can also call this function from your browser console for debugging
// @ts-ignore
window.debugAuth = debugAuthState;