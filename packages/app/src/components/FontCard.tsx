import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';
import { useTheme, alpha } from '@mui/material/styles';
import { legibilityScore, legibilityBand, LEGIBILITY_WEIGHTS } from '../lib/legibility';
import type { FontEntry } from '../data/fonts';
import { ScoreDonut } from './ScoreDonut';
import { MetricBars } from './MetricBars';
import { IconStar, IconStarBorder, IconClose, IconChevron } from '../icons';

interface FontCardProps {
  font: FontEntry;
  isPrimary: boolean;
  weights?: Record<string, number>;
  onPrimary: () => void;
  onRemove: () => void;
}

export function FontCard({ font, isPrimary, weights, onPrimary, onRemove }: FontCardProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const score = legibilityScore(font, weights ?? LEGIBILITY_WEIGHTS);
  const band = legibilityBand(score);

  return (
    <Paper variant="outlined" sx={{
      p: 1.25, borderRadius: 2.5, position: 'relative',
      borderColor: isPrimary ? 'primary.main' : 'divider',
      boxShadow: isPrimary ? `0 0 0 1px ${theme.palette.primary.main}` : 'none',
    }}>
      <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
        <ScoreDonut value={score} size={44} />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Typography noWrap sx={{ fontWeight: 600, fontSize: 13.5 }}>{font.name}</Typography>
            {font.bench && (
              <Tooltip title="Benchmark · designed for legibility" arrow>
                <Box sx={{ color: 'primary.main', display: 'flex' }}>
                  <IconStar size={13} />
                </Box>
              </Tooltip>
            )}
          </Stack>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mt: '1px' }}>
            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{font.cat}</Typography>
            <Box sx={{ width: 3, height: 3, borderRadius: 3, bgcolor: 'text.disabled' }} />
            <Typography sx={{ fontSize: 11, color: theme.palette[band.color].main, fontWeight: 600 }}>
              {band.label}
            </Typography>
          </Stack>
        </Box>
        <Stack>
          <Tooltip title={isPrimary ? 'Primary font' : 'Set as primary'} arrow>
            <IconButton size="small" onClick={onPrimary}
              sx={{ color: isPrimary ? 'primary.main' : 'text.disabled' }}>
              {isPrimary ? <IconStar size={16} /> : <IconStarBorder size={16} />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove from comparison" arrow>
            <IconButton size="small" onClick={onRemove}
              sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}>
              <IconClose size={15} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Box onClick={() => setOpen((o) => !o)} sx={{
        mt: 1, px: 1, py: 0.75, borderRadius: 1.5, cursor: 'pointer',
        bgcolor: alpha(theme.palette.text.primary, 0.035),
        fontFamily: font.css, fontSize: 19, lineHeight: 1.1,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>Il1 O0 · rn m · 0123</span>
        <Box sx={{ color: 'text.disabled', transform: open ? 'rotate(180deg)' : 'none', transition: '.2s', display: 'flex' }}>
          <IconChevron size={15} />
        </Box>
      </Box>

      <Collapse in={open} unmountOnExit>
        <Box sx={{ pt: 1 }}>
          <Typography sx={{ fontSize: 11.5, color: 'text.secondary', mb: 1, lineHeight: 1.5 }}>
            {font.blurb}
          </Typography>
          <MetricBars font={font} dense />
        </Box>
      </Collapse>
    </Paper>
  );
}
