'use client';

import React from 'react';
import { Box, Container, Typography, Link as MuiLink, Divider } from '@mui/material';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            gap: 4,
          }}
        >
          {/* About Section */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Nurturing Gardens
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
              Discover the right plants for your zone, with a focus on native and pollinator-friendly
              options. Let's grow together.
            </Typography>
          </Box>

          {/* Links Section */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} href="/browse" color="text.secondary" underline="hover">
                Browse Plants
              </MuiLink>
              <MuiLink component={Link} href="/blog" color="text.secondary" underline="hover">
                Blog
              </MuiLink>
              <MuiLink component={Link} href="/contact" color="text.secondary" underline="hover">
                Contact
              </MuiLink>
            </Box>
          </Box>

          {/* Legal Section */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} href="/legal/privacy" color="text.secondary" underline="hover">
                Privacy Policy
              </MuiLink>
              <MuiLink component={Link} href="/legal/terms" color="text.secondary" underline="hover">
                Terms of Service
              </MuiLink>
              <MuiLink
                component={Link}
                href="/legal/accessibility"
                color="text.secondary"
                underline="hover"
              >
                Accessibility
              </MuiLink>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Copyright and Attribution */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Nurturing Gardens. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Built by{' '}
            <MuiLink
              href="https://jpbranski.com"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              underline="hover"
            >
              JP Branski
            </MuiLink>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
