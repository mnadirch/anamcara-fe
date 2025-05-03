// Modified AuthCallback.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../api/supabase/client';

const AuthCallback = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
        try {
          console.log('Starting auth callback processing');
          
          // Get the session explicitly
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Session error:', error);
            setStatus('error');
            setErrorMessage(error.message);
            return;
          }
          
          if (data?.session) {
            console.log('Session found:', data.session);
            setStatus('success');
            
            // Add a small delay before redirect
            setTimeout(() => {
              navigate('/membership', { replace: true });
            }, 1000);
          } else {
            console.error('No session found in callback');
            setStatus('error');
            setErrorMessage('Authentication failed: No session found');
          }
        } catch (error: any) {
          console.error('Auth callback error:', error);
          setStatus('error');
          setErrorMessage(error.message || 'Unknown error during authentication');
        }
      };

    handleAuthCallback();
  }, [navigate]);

  if (status === 'loading') {
    return (
      <div className="auth-callback-container">
        <h2>Completing authentication...</h2>
        <p>Please wait while we complete the sign-in process.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="auth-callback-container">
        <h2>Authentication Failed</h2>
        <p>We couldn't complete the authentication process.</p>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button onClick={() => navigate('/auth/login')}>
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="auth-callback-container">
      <h2>Authentication Successful!</h2>
      <p>You have been successfully authenticated.</p>
      <p>Redirecting to your dashboard...</p>
    </div>
  );
};

export default AuthCallback;