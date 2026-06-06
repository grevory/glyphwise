import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import { useTheme, alpha } from '@mui/material/styles';
import { METRIC_META } from '../lib/legibility';
import type { FontEntry } from '../data/fonts';
import { Mono } from './Mono';

interface MetricBarsProps {
  font: FontEntry;
  dense?: boolean;
}

export function MetricBars({ font, dense }: MetricBarsProps) {
  const theme = useTheme();

  if (!font.metrics) {
    return (
      <Box sx={{ p: 1.25, borderRadius: 1.5, bgcolor: alpha(theme.palette.warning.main, 0.1) }}>
        <Typography sx={{ fontSize: 11.5, color: 'text.secondary', lineHeight: 1.5 }}>
          Metrics pending -- outline parsing (opentype.js) isn't wired into this prototype, so this upload renders as a live specimen only.
        </Typography>
      </Box>
    );
  }

  const m = font.metrics as unknown as Record<string, number>;

  return (
    <Stack spacing={dense ? 0.6 : 0.9} sx={{ mt: 0.5 }}>
      {METRIC_META.map((meta) => {
        const v = m[meta.key] ?? 0;
        return (
          <Box key={meta.key}>
            <Stack direction="row" sx={{ mb: '2px', justifyContent: 'space-between' }}>
              <Tooltip title={meta.hint} placement="left" arrow>
                <Typography sx={{ fontSize: 11.5, color: 'text.secondary', cursor: 'help' }}>
                  {meta.label}
                </Typography>
              </Tooltip>
              <Mono sx={{ fontSize: 11, color: 'text.secondary' }}>{v}</Mono>
            </Stack>
            <LinearProgress variant="determinate" value={v} sx={{
              height: 5, borderRadius: 3,
              bgcolor: alpha(theme.palette.text.primary, 0.08),
              '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: 'primary.main' },
            }} />
          </Box>
        );
      })}
    </Stack>
  );
}
