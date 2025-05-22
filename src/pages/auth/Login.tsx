import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn, signInWithGoogle } from '../../utils/auth';
import { useAuth } from '../../context/AuthProvider';
import GoogleIcon from '../../assets/svgs/GoogleIcon';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { setAuthData } = useAuth()
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await signIn(email, password);
            if (response.success) {
                const data = response.data;
                console.log(response.data)
                if (data) {
                    setAuthData({
                        accessToken: data?.session.access_token || null,
                        userId: data.session.user?.id || null,
                        role: data.profile.role,
                    })
                    localStorage.setItem("accessToken", data?.session.access_token);

                    if (data.profile.role === 'superadmin') {
                        navigate('/admin/blogs');
                    } else if (data.profile.role === 'user') {
                        navigate('/membership');
                    } else {
                        setError('Unauthorized: Role not supported');
                    }
                }
            } else {
                setError(response?.message || "Something went wrong!")
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
            await signInWithGoogle();
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
        <>
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
                    className={`w-full revolving-line-border py-2 bg-gray-700 hover:bg-[#A0FF06] text-white font-medium rounded-md transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''
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
                <GoogleIcon />
                <span>Sign in with Google</span>
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
        </>
    );
};

export default Login;