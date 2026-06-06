import React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import type { AppState } from '../lib/urlState';
import { ContrastCard } from './ContrastCard';
import { LegibilityRail } from './LegibilityRail';

interface ScoresRailProps {
  s: AppState;
  weights?: Record<string, number>;
}

export function ScoresRail({ s, weights }: ScoresRailProps) {
  return (
    <Box sx={{ p: 2 }}>
      <ContrastCard s={s} />
      <Divider sx={{ my: 2 }} />
      <LegibilityRail s={s} weights={weights} />
    </Box>
  );
}
