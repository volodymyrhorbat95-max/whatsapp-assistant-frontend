import { createTheme } from '@mui/material/styles';

// Create a custom theme with your preferred colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Blue-600 - customize this to your preferred color
      light: '#60a5fa',
      dark: '#1e40af',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7c3aed', // Purple-600
      light: '#a78bfa',
      dark: '#5b21b6',
      contrastText: '#ffffff',
    },
    success: {
      main: '#16a34a', // Green-600
      light: '#4ade80',
      dark: '#15803d',
      contrastText: '#ffffff',
    },
    error: {
      main: '#dc2626', // Red-600
      light: '#f87171',
      dark: '#b91c1c',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ea580c', // Orange-600
      light: '#fb923c',
      dark: '#c2410c',
      contrastText: '#ffffff',
    },
    info: {
      main: '#0891b2', // Cyan-600
      light: '#22d3ee',
      dark: '#0e7490',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 2,
  },
});

export default theme;
