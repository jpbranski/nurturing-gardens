'use client';

import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Link as MuiLink } from '@mui/material';
import Link from 'next/link';

const CONSENT_KEY = 'nurturing-gardens-cookie-consent';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <Paper
      elevation={4}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        zIndex: 1400,
      }}
    >
      <Box
        sx={{
          maxWidth: 'lg',
          mx: 'auto',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
        }}
      >
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          We use cookies and similar technologies to improve your experience, analyze site traffic,
          and display personalized ads. We also use Google Analytics and AdSense. By clicking "Accept",
          you consent to our use of cookies.{' '}
          <MuiLink component={Link} href="/legal/privacy" underline="hover">
            Learn more
          </MuiLink>
        </Typography>
        <Button variant="contained" onClick={handleAccept} sx={{ flexShrink: 0 }}>
          Accept
        </Button>
      </Box>
    </Paper>
  );
}
