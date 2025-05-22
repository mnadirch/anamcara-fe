import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        const handleEmailVerification = async () => {
            setVerificationStatus('loading')
            
            try {
                const hash = window.location.hash.substring(1);
                const params = new URLSearchParams(hash);
                const type = params.get('type');

                if (type === 'signup' || type === 'recovery') {
                    setVerificationStatus('success');
                    setTimeout(() => {
                        if (type === 'signup') {
                            navigate('/auth/login', {
                                state: { message: 'Email verified successfully! You can now log in.' }
                            });
                        } else if (type === 'recovery') {
                            navigate('/auth/reset-password');
                        }
                    }, 2000);
                } else {
                    setVerificationStatus('error');
                }
            } catch (error) {
                setVerificationStatus('error');
            }
        };

        handleEmailVerification();
    }, [navigate]);

    return (
        <>
            {email ? (
                <>
                    <h2 className="text-xl font-semibold text-white text-center mb-3">Registration Successful!</h2>

                    <p className="text-gray-300 text-center mb-4">
                        We've sent a verification email to <strong className="text-white">{email}</strong>.
                        Please check your inbox and follow the instructions to verify your account.
                    </p>

                    <button
                        onClick={() => navigate('/auth/login')}
                        className="w-full py-2 bg-[#A0FF06] hover:bg-[#8de206] text-gray-900 font-medium rounded-md transition duration-200"
                    >
                        Go to Login
                    </button>
                </>
            ) : (verificationStatus === 'loading' ? (
                <>
                    <h2 className="text-xl font-semibold text-white text-center mb-3">Registration Successful!</h2>

                    <p className="text-gray-300 text-center mb-4">
                        Verifying your email... <br />
                        Please wait while we verify your email address.
                    </p>
                </>
            ) : verificationStatus === 'error' ? (
                <>
                    <h2 className="text-xl font-semibold text-white text-center mb-3">Verification Failed</h2>

                    <p className="text-gray-300 text-center mb-4">
                        We couldn't verify your email. The link may be expired or invalid.
                    </p>

                    <button onClick={() => navigate('/auth/login')} className="w-full px-4 py-2 text-sm font-medium border border-[#ADFF00] transition-all duration-300 bg-[#ADFF00] text-black hover:bg-black hover:text-white">
                        Return to Login
                    </button>

                </>
            ) : (
                <>
                    <h2 className="text-xl font-semibold text-white text-center mb-3">Email Verified!</h2>

                    <p className="text-gray-300 text-center mb-4">
                        Your email has been successfully verified. <br />
                        Redirecting you to login...
                    </p>
                </>
            ))}
        </>
    )
}

export default VerifyEmail