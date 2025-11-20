'use client';

import React from 'react';
import { Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Plant } from '@/types/plant';
import { isIdealForZone } from '@/lib/zoneRanking';

interface ZoneBadgeProps {
  plant: Plant;
  zone: number;
  variant?: 'small' | 'large';
}

export default function ZoneBadge({ plant, zone, variant = 'small' }: ZoneBadgeProps) {
  const isIdeal = isIdealForZone(plant, zone);

  if (!isIdeal) {
    return null;
  }

  if (variant === 'large') {
    return (
      <Chip
        icon={<CheckCircleIcon />}
        label={`Perfect for Zone ${zone}`}
        color="success"
        sx={{
          fontWeight: 600,
          fontSize: '1rem',
          py: 2.5,
          px: 1
        }}
      />
    );
  }

  return (
    <Chip
      icon={<CheckCircleIcon />}
      label={`Zone ${zone}`}
      size="small"
      color="success"
      sx={{ fontSize: '0.75rem' }}
    />
  );
}
