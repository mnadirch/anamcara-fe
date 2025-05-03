// src/types/auth.ts
export type UserRole = 'superadmin' | 'user' | 'guest';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}
