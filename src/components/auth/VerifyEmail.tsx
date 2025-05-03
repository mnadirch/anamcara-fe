// src/components/auth/VerifyEmail.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../api/supabase/client';



const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get the URL hash to extract the access_token and refresh_token
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);

        // Check if we have a type=recovery or type=signup param which indicates email verification
        const type = params.get('type');

        console.log('Verification type:', type);

        if (type === 'signup' || type === 'recovery') {
          // Try to get session to confirm verification worked
          const { data, error } = await supabase.auth.getSession();

          if (error) {
            console.error('Session error during verification:', error);
            setVerificationStatus('error');
            return;
          }

          if (data.session) {
            console.log('Verification successful, session found');
            setVerificationStatus('success');

            // Wait a bit before redirecting to login or membership
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
            console.error('No session found after verification');
            setVerificationStatus('error');
          }
        } else {
          setVerificationStatus('error');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
      }
    };

    handleEmailVerification();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 bg-auth bg-cover">
      {/* Animated Border Wrapper */}
      <div className="relative w-full max-w-sm">
        <div className="glow-border rounded-lg pointer-events-none"></div>

        <div className="revolving-line-border bg-gray-800 rounded-lg p-6 z-10 w-full">
          <div className="bg-gray-800 shadow-xl rounded-lg p-8">
            {verificationStatus === 'loading' ? (
              <div className="verification-container flex items-center flex-col gap-5">
                <h2>Verifying your email...</h2>
                <p>Please wait while we verify your email address.</p>
              </div>
            ) : verificationStatus === 'error' ? (
              <div className="verification-container flex items-center flex-col gap-5">
                <h2>Verification Failed</h2>
                <p>We couldn't verify your email. The link may be expired or invalid.</p>
                <button onClick={() => navigate('/auth/login')} className="w-full px-4 py-2 text-sm font-medium border border-[#ADFF00] transition-all duration-300 bg-[#ADFF00] text-black hover:bg-black hover:text-white">
                  Return to Login
                </button>

              </div>
            ) : (
              <div className="verification-container bg-auth bg-cover flex items-center flex-col gap-5">
                <h2>Email Verified!</h2>
                <p>Your email has been successfully verified.</p>
                <p>Redirecting you to login...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  );
};


export default VerifyEmail;