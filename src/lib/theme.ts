'use client';

import { createTheme } from '@mui/material/styles';

// Font family - Lora will be loaded via Google Fonts link in the document head
// Fallback to Georgia and system serif fonts
const loraFontFamily = '"Lora", "Georgia", "Times New Roman", serif';

// Export a lora object for compatibility with existing code
export const lora = {
  style: {
    fontFamily: loraFontFamily,
  },
  className: '',
};

// Botanical color palette
// Backgrounds: warm off-white and light sage/green
// Accents: deeper green and muted terracotta
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2d5016', // Deep forest green
      light: '#5a7c3a',
      dark: '#1a3309',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#c97d60', // Muted terracotta
      light: '#d99b88',
      dark: '#a35a42',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fdfaf6', // Warm off-white
      paper: '#ffffff',
    },
    success: {
      main: '#6b8e4e', // Sage green
      light: '#8ca975',
      dark: '#4d6537',
    },
    info: {
      main: '#5d8aa8', // Soft blue
      light: '#84a5bd',
      dark: '#3f5f73',
    },
    warning: {
      main: '#d4a574', // Warm tan
      light: '#dfbb95',
      dark: '#a37e51',
    },
    error: {
      main: '#c65d4f', // Muted red
      light: '#d38276',
      dark: '#8f4137',
    },
    text: {
      primary: '#2d3319', // Dark olive for primary text
      secondary: '#5a6038', // Medium olive for secondary text
    },
  },
  typography: {
    fontFamily: loraFontFamily,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          },
          transition: 'box-shadow 0.3s ease',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

export default theme;
