import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../../utils/auth';

const Register: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const response = await signUp(email, password, firstName, lastName);
            if (response.success) {
                navigate('/auth/verify-email', { state: { email } })
            } else {
                setError(response.message);
            }

        } catch (err: any) {
            setError(err.message || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="text-xl font-semibold text-white text-center mb-3">Register</h2>

            {error && (
                <div className="bg-red-900/30 border border-red-500 text-red-100 px-3 py-2 rounded-md mb-3 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2 text-sm">
                <div className="flex space-x-2">
                    <div className="w-1/2">
                        <label htmlFor="firstName" className="block text-gray-300 mb-1">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#A0FF06]"
                            required
                        />
                    </div>
                    
                    <div className="w-1/2">
                        <label htmlFor="lastName" className="block text-gray-300 mb-1">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#A0FF06]"
                            required
                        />
                    </div>
                </div>

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
                        minLength={6}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-8 text-gray-400 hover:text-white text-sm"
                    >
                        {showPassword ? '👁' : '🙈'}
                    </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                    <label htmlFor="confirmPassword" className="block text-gray-300 mb-1">Confirm Password</label>
                    <input
                        type={showConfPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#A0FF06]"
                        required
                        minLength={6}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfPassword(!showConfPassword)}
                        className="absolute right-2 top-8 text-gray-400 hover:text-white text-sm"
                    >
                        {showConfPassword ? '👁' : '🙈'}
                    </button>
                </div>

                {/* Register Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 bg-gray-700 hover:bg-[#A0FF06] text-white font-medium rounded-md transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>

            {/* OR Divider */}
            <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-700"></div>
                <span className="px-3 text-xs text-gray-500">OR</span>
                <div className="flex-grow border-t border-gray-700"></div>
            </div>

            {/* Login Redirect */}
            <div className="mt-4 text-center text-sm">
                <span className="text-gray-400">Already have an account? </span>
                <Link to="/auth/login" className="text-[#A0FF06] hover:underline font-medium">
                    Login
                </Link>
            </div>
        </>
    );
};

export default Register;