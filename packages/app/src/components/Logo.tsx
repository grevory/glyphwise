import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Overline } from './Overline';

interface LogoProps {
  compact?: boolean;
}

export function Logo({ compact }: LogoProps) {
  return (
    <Stack direction="row" spacing={1.4} sx={{ alignItems: 'center' }}>
      <Box sx={{
        width: 38, height: 38, borderRadius: '11px', flexShrink: 0,
        background: 'linear-gradient(150deg, #6c4ff0, #5b3fd6 60%, #4a2fc0)',
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 22,
        boxShadow: '0 4px 14px rgba(91,63,214,.35)',
      }}>
        G
      </Box>
      {!compact && (
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 18, lineHeight: 1, letterSpacing: '-.01em' }}>
            Glyphcheck
          </Typography>
          <Overline sx={{ fontSize: 9.5, mt: '3px' }}>Font Accessibility Comparator</Overline>
        </Box>
      )}
    </Stack>
  );
}
