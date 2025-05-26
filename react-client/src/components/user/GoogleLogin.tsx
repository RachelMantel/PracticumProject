import React, { useEffect } from 'react';
import { Button, Box } from '@mui/material';
import { Google } from '@mui/icons-material';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleLoginProps {
  onSuccess: (token: string) => void;
  onError: (error: string) => void;
  loading?: boolean;
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({ onSuccess, onError, loading = false }) => {
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: (response: any) => {
            if (response.credential) {
              onSuccess(response.credential);
            } else {
              onError('Google login failed');
            }
          }
        });
      }
    };

    if (window.google) {
      initializeGoogleSignIn();
    } else {
      const checkGoogleLoaded = setInterval(() => {
        if (window.google) {
          initializeGoogleSignIn();
          clearInterval(checkGoogleLoaded);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkGoogleLoaded);
        onError('Google SDK failed to load. Please refresh the page.');
      }, 10000);
    }
  }, [onSuccess, onError]);

  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      onError('Google SDK not loaded. Please refresh the page.');
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<Google />}
        onClick={handleGoogleLogin}
        disabled={loading}
        sx={{
          borderColor: '#4285f4',
          color: '#4285f4',
          fontWeight: 'bold',
          py: 1.5,
          '&:hover': {
            borderColor: '#3367d6',
            backgroundColor: 'rgba(66, 133, 244, 0.04)'
          },
          '&:disabled': {
            opacity: 0.6
          }
        }}
      >
        {loading ? 'Connecting...' : 'Continue with Google'}
      </Button>
    </Box>
  );
};

export default GoogleLogin;