import { createTheme } from '@mui/material/styles';

export function buildTheme(mode: 'light' | 'dark') {
  const dark = mode === 'dark';
  return createTheme({
    palette: {
      mode,
      primary: { main: dark ? '#8f78ff' : '#6243e6' },
      secondary: { main: dark ? '#54d0c4' : '#0f8a7e' },
      success: { main: dark ? '#5fd08a' : '#12773e' },
      warning: { main: dark ? '#e7b552' : '#8f6009' },
      error: { main: dark ? '#f08a8a' : '#b83132' },
      background: {
        default: dark ? '#141121' : '#f4f4f7',
        paper: dark ? '#1b1828' : '#ffffff',
      },
      text: {
        primary: dark ? '#ece9f6' : '#221e2d',
        secondary: dark ? '#a09cb3' : '#5a5567',
        disabled: dark ? '#6e6a82' : '#767080',
      },
      divider: dark ? 'rgba(255,255,255,0.1)' : 'rgba(28,20,55,0.1)',
    },
    typography: {
      fontFamily: "'Public Sans', system-ui, sans-serif",
      button: { fontWeight: 600 },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: { defaultProps: { disableElevation: true } },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: 11.5,
            fontFamily: "'Public Sans', sans-serif",
            maxWidth: 270,
            lineHeight: 1.5,
            padding: '7px 10px',
            backgroundColor: dark ? '#2c2840' : '#2a2438',
          },
          arrow: { color: dark ? '#2c2840' : '#2a2438' },
        },
      },
      MuiChip: { styleOverrides: { root: { fontWeight: 500 } } },
    },
  });
}
