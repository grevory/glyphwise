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
      <Box
        component="img"
        src="/glyphcheck/glyphcheck-logo.png"
        alt="Glyphcheck"
        sx={{ width: 38, height: 38, borderRadius: '11px', flexShrink: 0, objectFit: 'contain' }}
      />
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
