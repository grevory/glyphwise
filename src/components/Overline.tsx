import React from 'react';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';

interface OverlineProps {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export function Overline({ children, sx }: OverlineProps) {
  return (
    <Typography
      sx={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '.14em',
        textTransform: 'uppercase',
        color: 'text.secondary',
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
}
