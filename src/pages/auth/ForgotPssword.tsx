import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendResetPasswordEmail } from '../../utils/auth';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await sendResetPasswordEmail(email);
            if (response.success) {
                setResetSent(true);
            } else {
                setError(response?.message || "Failed to send reset passowrd email!");
            }
        } catch (err: any) {
            setError(err.message || 'Failed to send password reset email');
        } finally {
            setLoading(false);
        }
    };

    if (resetSent) {
        return (
            <>
                <h2 className="text-2xl font-bold text-white text-center mb-2">Password Reset Email Sent</h2>
                <p className="text-gray-400 mb-6">
                    We've sent a password reset link to <span className="text-[#A0FF06] font-medium">{email}</span>.
                    Please check your inbox and follow the instructions to reset your password.
                </p>
                <Link to="/auth/login">
                    <button className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition duration-200">
                        Back to Login
                    </button>
                </Link>
            </>
        );
    }

    return (
        <>
            <h2 className="text-2xl font-bold text-white text-center mb-6">Forgot Password</h2>

            {error && (
                <div className="bg-red-900/30 border border-red-500 text-red-100 px-4 py-3 rounded-md mb-6">
                    {error}
                </div>
            )}

            <p className="text-gray-400 mb-6">
                Enter your email address below and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-gray-300 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#A0FF06]"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <Link to="/auth/login" className="text-[#A0FF06] hover:underline font-medium">
                    Back to Login
                </Link>
            </div>
        </>
    );
};

export default ForgotPassword;
