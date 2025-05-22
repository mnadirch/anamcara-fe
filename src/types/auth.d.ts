type UserRole = 'superadmin' | 'user' | 'guest';

interface UserProfile {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
    role: UserRole;
    created_at: string;
    updated_at: string;
}
