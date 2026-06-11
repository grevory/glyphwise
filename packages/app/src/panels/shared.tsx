import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import type { AppState } from '../lib/urlState';

interface SurfaceProps {
  s: AppState;
  children: React.ReactNode;
  sx?: object;
}

export function Surface({ s, children, sx }: SurfaceProps) {
  return (
    <Paper variant="outlined" sx={{
      bgcolor: s.bg, color: s.fg, borderRadius: 3, p: { xs: 2, md: 3 },
      borderColor: 'divider', transition: 'background-color .2s', ...sx,
    }}>
      {children}
    </Paper>
  );
}

interface FgLabelProps {
  s: AppState;
  children: React.ReactNode;
  sx?: object;
}

export function FgLabel({ s, children, sx }: FgLabelProps) {
  return (
    <Box sx={{
      fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600,
      letterSpacing: '.08em', textTransform: 'uppercase', color: s.fg, opacity: 0.55,
      ...sx,
    }}>
      {children}
    </Box>
  );
}
