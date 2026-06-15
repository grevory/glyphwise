import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Logo } from './components/Logo';
import { IconShare, IconSun, IconMoon, IconQuestion, IconFeedback, IconGithub } from './icons';

interface HeaderProps {
  mode: 'light' | 'dark';
  onToggleMode: () => void;
  onShare: () => void;
  onHowItWorks: () => void;
}

export function Header({ mode, onToggleMode, onShare, onHowItWorks }: HeaderProps) {
  return (
    <AppBar position="static" color="default" elevation={0}
      sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar sx={{ gap: 1.5, minHeight: { xs: 60, md: 64 } }}>
        <Logo />
        <Chip label="Beta" size="small" color="warning" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
        <Box sx={{ flex: 1 }} />

        <Tooltip arrow title="Use the score library on GitHub">
          <IconButton
            component="a"
            href="https://github.com/grevory/glyphcheck/tree/main/packages/score"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Use the score library on GitHub"
            sx={{ color: 'text.secondary' }}
          >
            <IconGithub size={20} />
          </IconButton>
        </Tooltip>
        <Tooltip arrow title="Send feedback">
          <IconButton
            component="a"
            href="https://docs.google.com/forms/d/e/1FAIpQLSdEFfk81kjNeDqMX-Eb-8I3n-lEKs0gjeTB8j3IfbUEa7FhEQ/viewform"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Send feedback"
            sx={{ color: 'text.secondary' }}
          >
            <IconFeedback size={20} />
          </IconButton>
        </Tooltip>
        <Tooltip arrow title="How Glyphcheck works: scoring methodology and usage guide">
          <IconButton onClick={onHowItWorks} aria-label="How Glyphcheck works: scoring methodology and usage guide" sx={{ color: 'text.secondary' }}>
            <IconQuestion size={20} />
          </IconButton>
        </Tooltip>
        <Tooltip arrow title="Copy share link">
          <IconButton onClick={onShare} aria-label="Copy share link" sx={{ color: 'text.secondary' }}>
            <IconShare size={20} />
          </IconButton>
        </Tooltip>
        <Tooltip arrow title={mode === 'dark' ? 'Switch to light' : 'Switch to dark'}>
          <IconButton onClick={onToggleMode} aria-label={mode === 'dark' ? 'Switch to light' : 'Switch to dark'} sx={{ color: 'text.secondary' }}>
            {mode === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
