import React, { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { logo } from '../../public';
import Loader from '../components/core/Loader';
import { useAuth } from '../context/AuthProvider';

const AuthLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const { accessToken } = useAuth()

    const checkAuthStatus = () => {
        if (accessToken) {
            navigate('/home')
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        checkAuthStatus();
    }, [location.pathname, accessToken]);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen flex items-center justify-center bg-auth bg-cover px-4">
            <motion.div
                className="relative w-full max-w-sm p-[1px] rounded-xl bg-gradient-to-r from-transparent via-[#A0FF06] to-transparent"
                style={{ backgroundSize: '300% 100%' }}
                animate={{ backgroundPosition: ['300% 0%', '-300% 0%'] }}
                transition={{
                    duration: 10,
                    delay: 1,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            >
                <div className="bg-gray-800 rounded-[0.75rem] p-6 relative z-10">
                    <div className="flex justify-center mb-3">
                        <img src={logo} alt="Logo" className="h-10 w-auto" />
                    </div>

                    <Suspense fallback={<Loader />}>
                        <Outlet />
                    </Suspense>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthLayout;
