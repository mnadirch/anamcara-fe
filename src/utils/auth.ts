import supabase from '../config/supabase';

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

// sign up user
const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
) => {
    try {
        const redirectTo = `${window.location.origin}/auth/verify-email/`;
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: redirectTo },
        });

        if (error) {
            return { success: false, message: error.message };
        }

        const user = data.user;

        if (user) {
            const response = await supabase.from('profiles').upsert({
                id: user.id,
                email: user.email,
                first_name: firstName,
                last_name: lastName,
                role: 'user',
            });

            if (response.error) {
                return {
                    success: false,
                    message: response.error.message
                };
            }
        }

        return { success: true, message: "User successfully registered!" };
    } catch (err: any) {
        return { success: false, message: err.message || "Unexpected error during sign up" };
    }
};

const signIn = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            return {
                success: false,
                message: error.message,
            };
        }

        if (!data?.user || !data?.session) {
            return {
                success: false,
                message: 'Authentication succeeded but session or user data is missing.',
            };
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError) {
            return {
                success: false,
                message: 'User authenticated, but profile could not be fetched.',
            };
        }

        return {
            success: true,
            data: {
                session: data.session,
                profile,
            },
        };
    } catch (err: any) {
        return { success: false, message: err.message || "Unexpected error during sign in" };
    }
};

// Oauth signin
const signInWithGoogle = async () => {
    try {
        const redirectTo = `${window.location.origin}/membership`;
        return await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo },
        });
    } catch (err: any) {
        return { error: err.message || "Unexpected error during Google Sign In" };
    }
};

// sign out
const signOut = async () => {
    try {
        return await supabase.auth.signOut();
    } catch (err: any) {
        return { error: err.message || "Unexpected error during sign out" };
    }
};

// get profile
const getProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    } catch (err: any) {
        console.error("Error fetching profile:", err.message);
        return null;
    }
};

// get session
const getSession = async () => {
    try {
        const {
            data: { session },
            error,
        } = await supabase.auth.getSession();

        if (error || !session) {
            return { success: false, message: "No session found!" };
        }

        return { success: true, data: session };
    } catch (err: any) {
        return { success: false, message: err.message || "Unexpected error getting session" };
    }
};

// get user
const getUser = async () => {
    try {
        return await supabase.auth.getUser();
    } catch (err: any) {
        return { error: err.message || "Unexpected error getting user" };
    }
};

// reset password email
const sendResetPasswordEmail = async (email: string) => {
    try {
        const options = {
            redirectTo: `${window.location.origin}/auth/verify-email/`
        };
        const response = await supabase.auth.resetPasswordForEmail(email, options);

        if (response.error) {
            return {
                success: false,
                message: response.error.message,
            };
        }
        return { success: true, data: response.data };
    } catch (err: any) {
        return { success: false, message: err.message || "Unexpected error during password reset email" };
    }
};

// reset password
const resetPassword = async (newPassword: string) => {
    try {
        const { data, error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            return {
                success: false,
                message: error.message,
            };
        }

        return {
            success: true,
            message: 'Password updated successfully!',
            data,
        };
    } catch (err: any) {
        console.log(err)
        return {
            success: false,
            message: err.message || "Unexpected error during password reset"
        };
    }
};

// auth state change
const onAuthStateChange = (
    callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
) => {
    return supabase.auth.onAuthStateChange(callback);
};

export {
    signIn,
    signInWithGoogle,
    signOut,
    getProfile,
    getUser,
    getSession,
    onAuthStateChange,
    sendResetPasswordEmail,
    resetPassword,
    signUp
};
