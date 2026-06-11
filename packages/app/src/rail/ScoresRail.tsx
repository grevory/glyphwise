import React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import type { AppState } from '../lib/urlState';
import type { FontEntry } from '../data/fonts';
import { ContrastCard } from './ContrastCard';
import { LegibilityRail } from './LegibilityRail';

interface ScoresRailProps {
  s: AppState;
  registry: Record<string, FontEntry>;
  weights?: Record<string, number>;
}

export function ScoresRail({ s, registry, weights }: ScoresRailProps) {
  return (
    <Box sx={{ p: 2 }}>
      <ContrastCard s={s} registry={registry} />
      <Divider sx={{ my: 2 }} />
      <LegibilityRail s={s} registry={registry} weights={weights} />
    </Box>
  );
}
