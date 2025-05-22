import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '../../utils/auth';
import { toast } from 'react-toastify';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            console.log(password)
            const response = await resetPassword(password);
            console.log(response)
            if (response.success) {
                toast.success("Password has been reset successfully!")
                navigate('/auth/login');
            } else {
                setError(response.success || "Failed to reset Password!");
            }
        } catch (err: any) {
            setError(err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Reset Password</h2>

            {error && (
                <div className="bg-red-900/30 border border-red-500 text-red-100 px-3 py-2 rounded-md mb-3 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2 text-sm">
                {/* Password */}
                <div className="relative">
                    <label htmlFor="password" className="block text-gray-300 mb-1">New Password</label>
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

                {/* confirm password */}
                <div className="relative">
                    <label htmlFor="confirmPassword" className="block text-gray-300 mb-1">Confirm New Password</label>
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

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full revolving-line-border py-2 bg-gray-700 hover:bg-[#A0FF06] text-white font-medium rounded-md transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                >
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </>
    );
};

export default ResetPassword;