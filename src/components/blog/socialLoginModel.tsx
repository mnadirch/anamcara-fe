import React from "react";
import shineLogo from "../../assets/images/main/ANAMCARA AI LOGO ICON TRANSPARENT 1.png";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SocialLoginModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-black rounded-lg p-6 w-[350px] shadow-lg overflow-hidden">
        {/* Animated Border */}
        <div className="absolute inset-0 border-2 border-[#ADFF00] animate-border pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
        >
          ✖
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="h-10 w-10 bg-gray-800 rounded-sm flex items-center justify-center">
            <div className="h-5 w-5 bg-yellow-500">
              <img
                src={shineLogo}
                alt="Shine Logo"
                className="absolute top-[11%] left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ width: "250px", pointerEvents: "none" }}
              />
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <h2 className="text-lg font-semibold text-center text-white">Bookmark this Story</h2>
        <p className="text-gray-400 text-sm text-center mt-1">
          Login or register to save your favourite articles.
        </p>

        {/* Social Login Buttons */}
        <div className="mt-4 space-y-3">
          <button className="w-full flex items-center justify-center px-4 py-2 border rounded-md bg-white text-gray-700 hover:bg-[#ADFF00]">
            <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" alt="Google" className="w-5 h-5 mr-3" />
            Sign in with Google
          </button>

          <button className="w-full flex items-center justify-center px-4 py-2 border rounded-md bg-white text-gray-700 hover:bg-[#ADFF00]">
            <img src="https://cdn-icons-png.flaticon.com/512/179/179309.png" alt="Apple" className="w-5 h-5 mr-3" />
            Sign in with Apple
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="px-2 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        {/* Email Sign-in */}
        <button className="w-full flex items-center justify-center px-4 py-2 border rounded-md bg-white text-gray-700 hover:bg-[#ADFF00]">
          <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Email" className="w-5 h-5 mr-3" />
          Sign in with Email
        </button>

        {/* Footer */}
        <p className="text-xs text-center text-gray-500 mt-4">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-blue-400 hover:underline">Terms of Service</a> and acknowledge our{" "}
          <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default SocialLoginModal;
