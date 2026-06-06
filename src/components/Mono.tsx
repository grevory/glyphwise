import React from 'react';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

interface MonoProps {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
  component?: React.ElementType;
}

export function Mono({ children, sx, component = 'span' }: MonoProps) {
  return (
    <Box component={component} sx={{ fontFamily: "'IBM Plex Mono', monospace", ...sx }}>
      {children}
    </Box>
  );
}
