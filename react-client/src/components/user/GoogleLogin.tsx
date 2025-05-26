// components/GoogleLogin.tsx
import React, { useEffect } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

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

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const GoogleLogin: React.FC<GoogleLoginProps> = ({ onSuccess, onError, loading = false }) => {
  console.log('🔍 Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
  
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      console.error('❌ Google Client ID is missing!');
      onError('Google Client ID is not configured. Please check your .env file.');
      return;
    }

    const initializeGoogleSignIn = () => {
      if (window.google) {
        
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            console.log('🎉 Google response:', response);
            if (response.credential) {
              onSuccess(response.credential);
            } else {
              onError('Google login failed');
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
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
    <Box sx={{ mt: 2, mb: 1 }}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          fullWidth
          variant="outlined"
          onClick={handleGoogleLogin}
          disabled={loading}
          sx={{
            height: '48px',
            borderRadius: '12px',
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: '500',
            
            borderColor: '#dadce0',
            backgroundColor: '#ffffff',
            color: '#3c4043',
            
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease-in-out',
            
            '&:hover': {
              borderColor: '#4285f4',
              backgroundColor: '#f8f9ff',
              boxShadow: '0 2px 8px rgba(66,133,244,0.15)',
              transform: 'translateY(-1px)',
            },
            
            '&:active': {
              transform: 'translateY(0)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            },
            
            '&:disabled': {
              opacity: 0.6,
              cursor: 'not-allowed',
              transform: 'none',
              '&:hover': {
                transform: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }
            },
            
            '& .MuiButton-startIcon': {
              marginRight: '12px',
              marginLeft: 0,
            }
          }}
          startIcon={
            loading ? (
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  border: '2px solid #f3f3f3',
                  borderTop: '2px solid #4285f4',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
            ) : (
              <GoogleIcon />
            )
          }
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: '500',
              fontSize: '16px',
              color: loading ? '#9aa0a6' : '#3c4043',
            }}
          >
            {loading ? 'Connecting to Google...' : 'Continue with Google'}
          </Typography>
        </Button>
      </motion.div>
      
      {/* הודעת עזרה קטנה */}
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          textAlign: 'center',
          color: 'text.secondary',
          mt: 1,
          fontSize: '12px',
          opacity: 0.7,
        }}
      >
        Sign in securely with your Google account
      </Typography>
    </Box>
  );
};

export default GoogleLogin;