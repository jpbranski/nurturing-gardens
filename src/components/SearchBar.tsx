'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TextField, InputAdornment, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder = 'Search plants by name...',
  autoFocus = false
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();

  // Handle keyboard shortcut (/) to focus search
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Focus search bar when "/" is pressed (and not in an input)
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Debounced onChange
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onChange(localValue);
    }, 150);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [localValue, onChange]);

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        inputRef={inputRef}
        fullWidth
        value={localValue}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="Search plants"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon aria-hidden="true" />
            </InputAdornment>
          ),
          sx: {
            borderRadius: 2,
            backgroundColor: 'background.paper'
          }
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2
          }
        }}
        helperText="Press '/' to focus search"
      />
    </Box>
  );
}
