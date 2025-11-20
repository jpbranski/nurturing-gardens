'use client';

import React, { useState, useEffect } from 'react';
import {
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Box
} from '@mui/material';
import { Plant } from '@/types/plant';

interface AutocompletePanelProps {
  suggestions: Plant[];
  onSelect: (plant: Plant) => void;
  onClose: () => void;
  visible: boolean;
}

export default function AutocompletePanel({
  suggestions,
  onSelect,
  onClose,
  visible
}: AutocompletePanelProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(0);
  }, [suggestions]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          onSelect(suggestions[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, suggestions, selectedIndex, onSelect, onClose]);

  if (!visible || suggestions.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={4}
      sx={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        mt: 0.5,
        maxHeight: 400,
        overflowY: 'auto',
        zIndex: 1000
      }}
      role="listbox"
    >
      <List dense disablePadding>
        {suggestions.slice(0, 5).map((plant, index) => (
          <ListItemButton
            key={plant.id}
            selected={index === selectedIndex}
            onClick={() => onSelect(plant)}
            role="option"
            aria-selected={index === selectedIndex}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'action.selected'
              }
            }}
          >
            <ListItemText
              primary={plant.commonName}
              secondary={
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                  >
                    {plant.scientificName}
                  </Typography>
                  {plant.plantType && (
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        '&::before': { content: '"• "' }
                      }}
                    >
                      {plant.plantType}
                    </Typography>
                  )}
                </Box>
              }
            />
          </ListItemButton>
        ))}
      </List>
      {suggestions.length > 5 && (
        <Box sx={{ p: 1, textAlign: 'center', borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            {suggestions.length - 5} more results available
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
