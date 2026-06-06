import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { useTheme, alpha } from '@mui/material/styles';
import { legibilityScore, legibilityBand, LEGIBILITY_WEIGHTS } from '../lib/legibility';
import { FONT_BY_ID } from '../data/fonts';
import type { AppState } from '../lib/urlState';
import { IconType, IconInfo, IconStar } from '../icons';
import { Overline } from '../components/Overline';
import { Mono } from '../components/Mono';

interface LegibilityRailProps {
  s: AppState;
  weights?: Record<string, number>;
}

export function LegibilityRail({ s, weights }: LegibilityRailProps) {
  const theme = useTheme();
  const w = weights ?? LEGIBILITY_WEIGHTS;

  const all = s.activeFonts
    .map((id) => FONT_BY_ID[id])
    .filter(Boolean)
    .map((f) => ({ f, score: legibilityScore(f, w) }));

  const ranked = all.filter((r) => r.score != null).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const pending = all.filter((r) => r.score == null);
  const max = Math.max(100, ...ranked.map((r) => r.score ?? 0));

  return (
    <Box sx={{ mt: 2.5 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.25 }}>
        <Box sx={{ color: 'primary.main', display: 'flex' }}><IconType size={17} /></Box>
        <Overline>Legibility</Overline>
        <Tooltip arrow title="Heuristic only -- no official legibility standard exists. Computed from font metrics: disambiguation, counter openness, x-height, stroke evenness, width. Not a certification.">
          <Box sx={{ color: 'text.disabled', display: 'flex', cursor: 'help' }}>
            <IconInfo size={14} />
          </Box>
        </Tooltip>
      </Stack>

      <Stack spacing={1.1}>
        {ranked.map(({ f, score }, i) => {
          const band = legibilityBand(score);
          const col = theme.palette[band.color].main;
          const isPrimary = f.id === s.activeFonts[0];
          return (
            <Box key={f.id}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: '3px' }}>
                <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', minWidth: 0 }}>
                  <Mono sx={{ fontSize: 10.5, color: 'text.disabled', width: 14 }}>{i + 1}</Mono>
                  <Typography noWrap sx={{ fontSize: 12.5, fontWeight: isPrimary ? 700 : 500 }}>
                    {f.name}
                  </Typography>
                  {f.bench && (
                    <Box sx={{ color: 'primary.main', display: 'flex' }}><IconStar size={11} /></Box>
                  )}
                </Stack>
                <Mono sx={{ fontSize: 13, fontWeight: 600, color: col }}>{score}</Mono>
              </Stack>
              <Box sx={{ height: 7, borderRadius: 4, bgcolor: alpha(theme.palette.text.primary, 0.08), overflow: 'hidden' }}>
                <Box sx={{
                  height: '100%',
                  width: `${((score ?? 0) / max) * 100}%`,
                  bgcolor: col, borderRadius: 4,
                  transition: 'width .5s ease',
                }} />
              </Box>
            </Box>
          );
        })}

        {pending.map(({ f }) => (
          <Box key={f.id} sx={{ opacity: 0.6 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: '3px' }}>
              <Typography noWrap sx={{ fontSize: 12.5, fontWeight: 500 }}>{f.name}</Typography>
              <Mono sx={{ fontSize: 11, color: 'text.secondary' }}>pending</Mono>
            </Stack>
            <Box sx={{
              height: 7, borderRadius: 4,
              bgcolor: alpha(theme.palette.text.primary, 0.06),
              backgroundImage: `repeating-linear-gradient(45deg, transparent 0 5px, ${alpha(theme.palette.text.primary, 0.07)} 5px 10px)`,
            }} />
          </Box>
        ))}
      </Stack>

      <Typography sx={{ fontSize: 10.5, color: 'text.disabled', mt: 1.5, lineHeight: 1.5 }}>
        Weights -- disambiguation 30 · counters 22 · x-height 20 · evenness 16 · width 12.
        A heuristic proxy, not a standard.
      </Typography>
    </Box>
  );
}
