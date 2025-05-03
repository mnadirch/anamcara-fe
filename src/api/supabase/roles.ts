import supabase from './client';
import { UserRole } from '../../types/auth';

export async function getUserRole(userId: string): Promise<UserRole> {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data.role;
}

export async function updateUserRole(userId: string, role: UserRole) {
  // First check if the current user is a superadmin
  const { data: currentUser } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', await getCurrentUserId())
    .single();
  
  if (currentUser?.role !== 'superadmin') {
    throw new Error('Only superadmins can update user roles');
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);
  
  if (error) throw error;
  return data;
}

async function getCurrentUserId(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No active session');
  return session.user.id;
}