"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode
} from 'react';
import {
    getSession,
    getUser,
    getProfile,
    onAuthStateChange,
    signOut
} from '../utils/auth';

type AuthData = {
    userId: any;
    accessToken: string | null;
    role: string | null;
};

type userData = {
    avatar_url: string | null;
    email: string | null;
    first_name: string | null;
    id: string | null;
    last_name: string | null;
    role: 'superadmin' | 'admin' | 'user' | null;
};

type AuthContextType = AuthData & {
    loading: boolean;
    setAuthData: React.Dispatch<React.SetStateAction<AuthData>>;
    logout: () => Promise<void>;
    userData: userData;
    setUserData: React.Dispatch<React.SetStateAction<userData>>;
};

const AuthContext = createContext<AuthContextType>({
    userId: null,
    accessToken: null,
    role: null,
    loading: true,
    setAuthData: () => { },
    logout: async () => { },
    userData: {
        avatar_url: null,
        email: null,
        first_name: null,
        id: null,
        last_name: null,
        role: null,
    },
    setUserData: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [userData, setUserData] = useState<userData>({
        avatar_url: null,
        email: null,
        first_name: null,
        id: null,
        last_name: null,
        role: null,
    });

    const [authData, setAuthData] = useState<AuthData>({
        userId: null,
        accessToken: null,
        role: null
    });

    const updateAuthData = (partial: Partial<AuthData>) => {
        setAuthData((prev) => ({ ...prev, ...partial }));
    };

    const fetchSessionData = async () => {
        setLoading(true);
        try {
            const response = await getSession();
            if (!response.success || !response.data) {
                setAuthData({ userId: null, accessToken: null, role: null });
                return;
            }

            const session = response.data;
            const userRes = await getUser();
            // @ts-ignore
            const currentUser = userRes.data?.user;

            if (!currentUser) {
                setLoading(false);
                setAuthData({ userId: null, accessToken: null, role: null });
                return;
            }

            const profile = await getProfile(currentUser.id);
            localStorage.setItem("accessToken", session.access_token);

            setAuthData({
                userId: currentUser.id,
                accessToken: session.access_token,
                role: profile?.role || 'user'
            });
        } catch (error) {
            console.error('Auth error:', error);
            setAuthData({ userId: null, accessToken: null, role: null });
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await signOut();
            setAuthData({ userId: null, accessToken: null, role: null });
            localStorage.removeItem('accessToken');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const fetchProfile = async (): Promise<void> => {
        if (!authData.userId) return;

        try {
            const response = await getProfile(authData.userId);

            if (response) {
                setUserData({
                    avatar_url: response.avatar_url ?? null,
                    email: response.email ?? null,
                    first_name: response.first_name ?? null,
                    id: response.id ?? null,
                    last_name: response.last_name ?? null,
                    role: response.role === 'guest' ? 'user' : response.role,
                });
            } else {
                console.warn("No profile found for user ID:", authData.userId);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    useEffect(() => {
        fetchSessionData();

        // const { data: subscriptionData } = onAuthStateChange(async (_event: any, session: any) => {
        //     if (session) {
        //         const profile = await getProfile(session.user.id);
        //         updateAuthData({
        //             userId: session.user.id,
        //             accessToken: session.access_token || null,
        //             role: profile?.role || 'user'
        //         });
        //     } else {
        //         setAuthData({ userId: null, accessToken: null, role: null });
        //         setLoading(false);
        //     }
        // });

        // return () => {
        //     subscriptionData?.subscription?.unsubscribe?.();
        // };
    }, []);

    useEffect(() => {
        fetchProfile()
    }, [authData])

    // if (loading) return <Loader />;

    return (
        <AuthContext.Provider
            value={{
                ...authData,
                loading,
                setAuthData,
                logout,
                userData,
                setUserData
            }}
        >
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext);
