import React from 'react';
import Box from '@mui/material/Box';
import { useTheme, alpha } from '@mui/material/styles';
import { legibilityBand } from '../lib/legibility';
import { Mono } from './Mono';

interface ScoreDonutProps {
  value: number | null;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
}

export function ScoreDonut({ value, size = 46, stroke = 5, color, label }: ScoreDonutProps) {
  const theme = useTheme();
  const band = legibilityBand(value);
  const col = color ?? theme.palette[band.color].main;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = value == null ? 0 : Math.max(0, Math.min(100, value));
  const off = c * (1 - pct / 100);

  return (
    <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={alpha(theme.palette.text.primary, 0.1)} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col}
          strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c}
          strokeDashoffset={off} transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset .5s ease, stroke .3s' }} />
      </svg>
      <Box sx={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', lineHeight: 1,
      }}>
        <Mono sx={{ fontWeight: 600, fontSize: size * 0.32 }}>{value == null ? '–' : value}</Mono>
        {label && <Mono sx={{ fontSize: 8, color: 'text.secondary', mt: '1px' }}>{label}</Mono>}
      </Box>
    </Box>
  );
}
