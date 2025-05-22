import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from '../../context/AuthProvider';
import PrimaryButton from '../addons/PrimaryButton';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navbarRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { accessToken, loading, logout, userData } = useAuth();

  const getPageTitle = () => {
    const path = location.pathname;

    if (path.startsWith('/admin/')) {
      const parts = path.split('/').filter(Boolean);
      if (parts.length > 1) {
        const routeName = parts[1];
        return routeName
          .charAt(0).toUpperCase() +
          routeName.slice(1).replace(/-/g, ' ');
      }
    }

    return 'Dashboard';
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (navbarRef.current) {
        const navbarHeight = navbarRef.current.offsetHeight;
        const shouldStick = window.scrollY > navbarHeight;

        if (shouldStick !== isSticky) {
          setIsSticky(shouldStick);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSticky]);

  // Animation variants
  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.1 }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const menuItemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        ease: "easeOut"
      }
    }),
    hover: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <div
      ref={navbarRef}
      className={`w-full ${isSticky ? 'fixed top-0 z-50 shadow-lg' : 'relative'} transition-all duration-300`}
    >
      <nav className="bg-[#1b1b1b] rounded-2xl py-4 px-6 flex items-center justify-between">
        {/* Page Title */}
        <h1 className="text-xl font-semibold text-white">
          {getPageTitle()}
        </h1>

        {/* User Profile */}
        <div className="relative ml-2" ref={userMenuRef}>
          {loading ? (
            <div className='py-2 px-5'>
              <div className="w-7 h-7 rounded-full bg-gray-700 animate-pulse" />
            </div>
          ) : (
            !accessToken ?
              <PrimaryButton text={"Sign in"} onClick={() => navigate("/auth/login")} className='!py-2' />
              : (
                <button
                  className="flex items-center text-sm rounded-full focus:outline-none transition-transform hover:scale-105 duration-200"
                  onClick={toggleUserMenu}
                >
                  <div className="md:w-8 md:h-8 w-6 h-6 rounded-full cursor-pointer overflow-hidden bg-secondary flex items-center justify-center">
                    {userData.avatar_url && userData.first_name ? (
                      <img
                        src={userData.avatar_url}
                        alt={userData.first_name}
                        className="!relative md:!w-8 md:!h-8 !w-6 !h-6"
                      />
                    ) : (
                      <FiUser className="h-6 w-6 text-white transition-all duration-300 hover:text-gray-300" />
                    )}
                  </div>
                </button>
              )
          )}

          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
                className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[#2a2a2a] ring-1 ring-gray-700 ring-opacity-5 z-20"
              >
                <div className="py-1" role="menu">
                  <motion.div 
                    className="px-4 py-3 border-b border-gray-700"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <p className="text-sm font-medium text-white capitalize">
                      {userData.first_name}{userData.last_name ? ` ${userData.last_name}` : ''}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{userData.email}</p>
                  </motion.div>

                  <motion.button
                    variants={menuItemVariants}
                    custom={0}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }} 
                    className="w-full cursor-pointer flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white border-t border-gray-700"
                  >
                    <FiLogOut className="mr-3 h-5 w-5 text-gray-400" />
                    Sign out
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </div>
  );
};

export default DashboardNavbar;