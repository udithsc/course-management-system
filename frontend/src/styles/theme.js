import { createTheme } from '@mui/material/styles';

const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#6366F1',
        light: '#818CF8',
        dark: '#4F46E5',
        contrastText: '#fff',
      },
      secondary: {
        main: '#10B981',
        light: '#34D399',
        dark: '#059669',
      },
      error:   { main: '#F43F5E' },
      warning: { main: '#F59E0B' },
      info:    { main: '#3B82F6' },
      success: { main: '#10B981' },
      background: {
        default: mode === 'light' ? '#F1F5F9' : '#0D1117',
        paper:   mode === 'light' ? '#FFFFFF'  : '#161B27',
      },
      text: {
        primary:   mode === 'light' ? '#0F172A' : '#F1F5F9',
        secondary: mode === 'light' ? '#64748B' : '#8892A4',
      },
      divider: mode === 'light' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)',
    },
    typography: {
      fontFamily: '"Inter", "Outfit", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      h1: { fontWeight: 800, letterSpacing: '-0.03em' },
      h2: { fontWeight: 800, letterSpacing: '-0.02em' },
      h3: { fontWeight: 700, letterSpacing: '-0.015em' },
      h4: { fontWeight: 700, letterSpacing: '-0.01em' },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 14 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: mode === 'light'
              ? 'linear-gradient(135deg, #F1F5F9 0%, #E8EEF7 100%)'
              : 'linear-gradient(135deg, #0D1117 0%, #111827 100%)',
            minHeight: '100vh',
          },
          '*::-webkit-scrollbar': { width: '6px', height: '6px' },
          '*::-webkit-scrollbar-track': { background: 'transparent' },
          '*::-webkit-scrollbar-thumb': {
            background: mode === 'light' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.1)',
            borderRadius: '6px',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '10px',
            boxShadow: 'none',
            padding: '9px 22px',
            fontWeight: 600,
            '&:hover': { boxShadow: '0 4px 16px rgba(99,102,241,0.25)' },
          },
          contained: {
            '&:hover': { boxShadow: '0 8px 22px rgba(99,102,241,0.35)' },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '18px',
            border: mode === 'light' ? '1px solid rgba(15,23,42,0.07)' : '1px solid rgba(255,255,255,0.05)',
            boxShadow: mode === 'light'
              ? '0 4px 24px rgba(15,23,42,0.06)'
              : '0 4px 24px rgba(0,0,0,0.3)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600 },
        },
      },
    },
  });

export default getTheme;
