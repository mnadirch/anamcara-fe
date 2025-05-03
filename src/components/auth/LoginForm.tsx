import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../api/services/AuthService';
import NavbarLogo from "../../assets/images/navabarlogo/ANAMCARA AI LOGO ICON TRANSPARENT 2.png";
import './global.css';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      console.log('Attempting login with:', email);
      const response = await AuthService.signIn(email, password);
      console.log('Login completed successfully', response);
      const profile = response.profile; // Assuming the response contains the profile data
      console.log('User profile:', profile);
      if (profile?.role === 'superadmin') {
    navigate('/dashboard/blogs');
  } else if (profile?.role === 'user') {
    navigate('/membership');
  } else {
    setError('Unauthorized: Role not supported');
  }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.log(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      console.log('Starting Google login process from LoginForm');
      await AuthService.signInWithGoogle();
      // The redirect will happen automatically via Supabase
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.log(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-auth bg-cover">
      {/* Animated Border Wrapper */}
      <div className="relative w-full max-w-sm">
        <div className="glow-border rounded-lg pointer-events-none"></div>

        <div className="revolving-line-border bg-gray-800 rounded-lg p-6 z-10 w-full">
          <div className="flex justify-center mb-3">
            <img src={NavbarLogo} alt="Logo" className="h-10 w-auto" />
          </div>
          <h2 className="text-xl font-semibold text-white text-center mb-3">Login</h2>

          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-100 px-3 py-2 rounded-md mb-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2 text-sm">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-300 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#A0FF06]"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="block text-gray-300 mb-1">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#A0FF06]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-8 text-gray-400 hover:text-white text-sm"
              >
                {showPassword ? '👁' : '🙈'}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full revolving-line-border py-2 bg-gray-700 hover:bg-[#A0FF06] text-white font-medium rounded-md transition duration-200 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="px-3 text-xs text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <button
        type="button"
          onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 bg-gray-700 hover:bg-[#A0FF06] text-white font-medium rounded-md transition duration-200"
>
         {/* Google Icon */}
          <svg
          className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.34 1.45 8.29 2.67l6.12-6.12C34.27 2.5 29.63 0 24 0 14.84 0 7.36 5.74 3.88 13.65l7.34 5.7C13 13.54 18.09 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.1 24.55c0-1.7-.15-3.33-.43-4.9H24v9.3h12.4c-.53 2.9-2.1 5.36-4.47 7.06l6.9 5.36c4.03-3.72 6.27-9.2 6.27-15.82z"
    />
    <path
      fill="#FBBC05"
      d="M10.22 28.82A14.53 14.53 0 019.5 24c0-1.68.3-3.3.83-4.82l-7.34-5.7A23.936 23.936 0 000 24c0 3.89.93 7.56 2.55 10.82l7.67-6z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.91-2.14 15.88-5.82l-6.9-5.36c-2.12 1.43-4.82 2.27-8.98 2.27-5.91 0-11-4.04-12.78-9.66l-7.67 6C8.88 43.35 15.91 48 24 48z"
    />
  </svg>

  Sign in with Google
</button>

          {/* Links */}
          <div className="mt-4 text-center text-sm">
            <div className="mb-2">
              <span className="text-gray-400">Don't have an account? </span>
              <Link to="/auth/register" className="text-[#A0FF06] hover:underline font-medium">
                Register
              </Link>
            </div>
            <div>
              <Link to="/auth/forgot-password" className="text-[#A0FF06] hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;