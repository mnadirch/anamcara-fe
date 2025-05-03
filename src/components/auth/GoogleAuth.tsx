// src/components/auth/GoogleAuth.tsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface GoogleAuthProps {
  buttonText?: string;
  className?: string;
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({
  buttonText = 'Sign in with Google',
  className = 'google-login-button'
}) => {
  
  // @ts-ignore
  const { loginWithGoogle, authState } = useAuth();
  const { isLoading } = authState;
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      console.log('Starting Google login process');
      await loginWithGoogle();
      // The redirect will happen automatically via Supabase
    } catch (error: any) {
      console.error('Google login error:', error);
      setError(error.message || 'Failed to login with Google');
    }
  };

  return (
    <div>
      <button
        type="button"
        className={className}
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : buttonText}
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default GoogleAuth;