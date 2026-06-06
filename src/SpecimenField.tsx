import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { SPECIMEN_PRESETS } from './data/specimens';
import { Overline } from './components/Overline';
import { IconChevron } from './icons';
import type { AppState } from './lib/urlState';

interface SpecimenFieldProps {
  s: AppState;
  set: (patch: Partial<AppState>) => void;
}

export function SpecimenField({ s, set }: SpecimenFieldProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const presetKeys = Object.keys(SPECIMEN_PRESETS);

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, p: 1.5, borderColor: 'divider' }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Overline sx={{ whiteSpace: 'nowrap' }}>Specimen text</Overline>
        <TextField fullWidth size="small" placeholder="Bring your own text..."
          value={s.text} onChange={(e) => set({ text: e.target.value })}
          slotProps={{ input: { sx: { fontSize: 13.5 } } }} />
        <Button size="small" onClick={(e) => setAnchor(e.currentTarget)}
          endIcon={<IconChevron size={14} />}
          sx={{ textTransform: 'none', color: 'text.secondary', whiteSpace: 'nowrap' }}>
          Presets
        </Button>
        <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
          {presetKeys.map((k) => (
            <MenuItem key={k}
              onClick={() => { set({ text: SPECIMEN_PRESETS[k] }); setAnchor(null); }}
              sx={{ fontSize: 13, textTransform: 'capitalize' }}>
              {k}
            </MenuItem>
          ))}
          <MenuItem onClick={() => { set({ text: '' }); setAnchor(null); }}
            sx={{ fontSize: 13, color: 'text.secondary' }}>
            Reset to default
          </MenuItem>
        </Menu>
      </Stack>
    </Paper>
  );
}
