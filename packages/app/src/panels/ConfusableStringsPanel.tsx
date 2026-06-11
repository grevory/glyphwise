import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import { genKeyBatch } from '../lib/strings';
import type { AppState } from '../lib/urlState';
import { Surface, FgLabel } from './shared';
import { specimenStyle, fontList, gridCols } from './shared-utils';
import { IconRefresh } from '../icons';

interface Props { s: AppState }

export function ConfusableStringsPanel({ s }: Props) {
  const fonts = fontList(s);
  const [seed, setSeed] = useState(20260604);
  const keys = useMemo(() => genKeyBatch(seed, 6), [seed]);

  return (
    <Surface s={s}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <FgLabel s={s}>Confusable strings</FgLabel>
          <Typography sx={{ fontSize: 13, color: s.fg, opacity: 0.6, mt: 0.5, maxWidth: 520 }}>
            Random license-key / one-time-code strings drawn from a confusable-heavy alphabet -- where a single misread character breaks everything.
          </Typography>
        </Box>
        <Button size="small" variant="outlined" startIcon={<IconRefresh size={14} />}
          onClick={() => setSeed(Math.floor(Math.random() * 1e9))}
          sx={{
            textTransform: 'none', color: s.fg, borderColor: alpha(s.fg, 0.3), flexShrink: 0,
            '&:hover': { borderColor: s.fg, bgcolor: alpha(s.fg, 0.04) },
          }}>
          Regenerate
        </Button>
      </Stack>

      <Box sx={{ ...gridCols(fonts.length), gap: 2 }}>
        {fonts.map((f, i) => (
          <Box key={f.id}>
            <FgLabel s={s} sx={{ fontSize: 10, mb: 1, display: 'block' }}>
              {f.name}{i === 0 ? ' · primary' : ''}
            </FgLabel>
            <Stack spacing={0.75}>
              {keys.map((k, j) => (
                <Box key={j}
                  style={specimenStyle(s, f.css, {
                    fontSize: Math.max(s.size, 13),
                    letterSpacing: (Math.max(s.letterSpacing, 0.04)) + 'em',
                  }) as React.CSSProperties}
                  sx={{ py: 0.4, borderBottom: `1px dashed ${alpha(s.fg, 0.1)}` }}>
                  {k}
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
      </Box>
    </Surface>
  );
}
