import React from 'react';
import Box from '@mui/material/Box';
import { useTheme, alpha } from '@mui/material/styles';
import { Overline } from './Overline';
import { Mono } from './Mono';

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  hideLabel?: boolean;
}

export function ColorField({ label, value, onChange, hideLabel }: ColorFieldProps) {
  const theme = useTheme();
  return (
    <Box component="label" sx={{
      display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.6,
      border: '1px solid', borderColor: 'divider', borderRadius: 2, cursor: 'pointer',
      '&:hover': { borderColor: 'text.secondary' }, flex: hideLabel ? '0 0 auto' : 1, minWidth: 0,
    }}>
      <Box sx={{
        width: 26, height: 26, borderRadius: '7px', flexShrink: 0,
        bgcolor: value,
        boxShadow: `inset 0 0 0 1px ${alpha(theme.palette.text.primary, 0.18)}`,
      }} />
      {!hideLabel && (
        <Box sx={{ minWidth: 0 }}>
          <Overline sx={{ fontSize: 8 }}>{label}</Overline>
          <Mono sx={{ fontSize: 12, display: 'block', lineHeight: 1.1 }}>{value.toUpperCase()}</Mono>
        </Box>
      )}
      <input
        type="color" value={value} onChange={(e) => onChange(e.target.value)}
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
      />
    </Box>
  );
}
