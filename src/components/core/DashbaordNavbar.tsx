import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { useAuth } from '../../context/AuthProvider';
import PrimaryButton from '../addons/PrimaryButton';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from "react-router-dom";
// import { logo } from "../../../public"; // <-- Add this import

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { accessToken, loading, logout, userData } = useAuth();

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
    <nav
      className="bg-black w-full px-6 md:py-3 py-2 border-b border-[#0766FF]/30 shadow-[0px_0px_10px_#0766FF] flex items-center justify-between z-50"
    >
      <div className="w-full flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-3 group">
          {/* <img src={logo} alt="Logo" className="w-10 h-auto" /> */}
          <span className="md:text-2xl text-xl !font-bold tracking-wide font-mowaq logo-anim">
            ANAMCARA
          </span>
        </Link>

        {/* User Profile */}
        <div className="relative" ref={userMenuRef}>
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
              <div className="w-20 h-4 bg-gray-300 rounded-full animate-pulse hidden sm:block" />
            </div>
          ) : (
            !accessToken ? (
              <PrimaryButton
                text="Sign in"
                onClick={() => navigate("/auth/login")}
                className="!py-2 !px-4 !rounded-2xl"
              />
            ) : (
              <button
                className="flex items-center cursor-pointer gap-3 p-3 rounded-xl transition-all duration-200 focus:outline-none"
                onClick={toggleUserMenu}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#0766FF] flex items-center justify-center">
                  {userData.avatar_url && userData.first_name ? (
                    <img
                      src={userData.avatar_url}
                      alt={userData.first_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="hidden sm:block text-left font-mowaq">
                  <div className="text-xs font-medium capitalize">
                    {userData.first_name}{userData.last_name ? ` ${userData.last_name}` : ''}
                  </div>
                  <div className="text-[10px] opacity-70">
                    {userData.email}
                  </div>
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
                className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-black ring-1 ring-[#0766FF] z-50"
              >
                <div className="py-2" role="menu">
                  <motion.div
                    className="px-4 py-3 border-b border-gray-800 sm:hidden text-left font-mowaq"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="text-xs font-medium capitalize">
                      {userData.first_name}{userData.last_name ? ` ${userData.last_name}` : ''}
                    </div>
                    <div className="text-[10px] opacity-70">
                      {userData.email}
                    </div>
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
                    className="w-full flex items-center cursor-pointer px-4 py-3 text-sm text-white hover:bg-gray-800 transition-colors"
                  >
                    <FaSignOutAlt className="mr-3 h-4 w-4 text-[#00DCFF]" />
                    Sign out
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;