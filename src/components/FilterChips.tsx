'use client';

import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { SunExposure, WaterNeeds, PlantType } from '@/types/plant';

export interface ChipFilters {
  sunExposure: SunExposure[];
  waterNeeds: WaterNeeds | null;
  specialAttributes: string[]; // 'native', 'pollinator', 'toxic', 'non-toxic', 'beginner-friendly'
  plantTypes: PlantType[];
}

interface FilterChipsProps {
  filters: ChipFilters;
  onChange: (filters: ChipFilters) => void;
}

export default function FilterChips({ filters, onChange }: FilterChipsProps) {
  const toggleSunExposure = (exposure: SunExposure) => {
    const newSunExposure = filters.sunExposure.includes(exposure)
      ? filters.sunExposure.filter(e => e !== exposure)
      : [...filters.sunExposure, exposure];
    onChange({ ...filters, sunExposure: newSunExposure });
  };

  const toggleWaterNeeds = (water: WaterNeeds) => {
    onChange({
      ...filters,
      waterNeeds: filters.waterNeeds === water ? null : water
    });
  };

  const toggleSpecialAttribute = (attr: string) => {
    const newAttrs = filters.specialAttributes.includes(attr)
      ? filters.specialAttributes.filter(a => a !== attr)
      : [...filters.specialAttributes, attr];
    onChange({ ...filters, specialAttributes: newAttrs });
  };

  const togglePlantType = (type: PlantType) => {
    const newTypes = filters.plantTypes.includes(type)
      ? filters.plantTypes.filter(t => t !== type)
      : [...filters.plantTypes, type];
    onChange({ ...filters, plantTypes: newTypes });
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Sun Exposure */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Sun Exposure
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'nowrap',
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': {
              height: 6
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: 3
            }
          }}
        >
          <Chip
            label="Full Sun"
            onClick={() => toggleSunExposure('full-sun')}
            color={filters.sunExposure.includes('full-sun') ? 'primary' : 'default'}
            variant={filters.sunExposure.includes('full-sun') ? 'filled' : 'outlined'}
            sx={{ flexShrink: 0 }}
          />
          <Chip
            label="Part Sun"
            onClick={() => toggleSunExposure('part-sun')}
            color={filters.sunExposure.includes('part-sun') ? 'primary' : 'default'}
            variant={filters.sunExposure.includes('part-sun') ? 'filled' : 'outlined'}
            sx={{ flexShrink: 0 }}
          />
          <Chip
            label="Shade"
            onClick={() => toggleSunExposure('shade')}
            color={filters.sunExposure.includes('shade') ? 'primary' : 'default'}
            variant={filters.sunExposure.includes('shade') ? 'filled' : 'outlined'}
            sx={{ flexShrink: 0 }}
          />
        </Box>
      </Box>

      {/* Water Needs */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Water Needs
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'nowrap',
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': {
              height: 6
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: 3
            }
          }}
        >
          <Chip
            label="Low"
            onClick={() => toggleWaterNeeds('low')}
            color={filters.waterNeeds === 'low' ? 'primary' : 'default'}
            variant={filters.waterNeeds === 'low' ? 'filled' : 'outlined'}
            sx={{ flexShrink: 0 }}
          />
          <Chip
            label="Medium"
            onClick={() => toggleWaterNeeds('medium')}
            color={filters.waterNeeds === 'medium' ? 'primary' : 'default'}
            variant={filters.waterNeeds === 'medium' ? 'filled' : 'outlined'}
            sx={{ flexShrink: 0 }}
          />
          <Chip
            label="High"
            onClick={() => toggleWaterNeeds('high')}
            color={filters.waterNeeds === 'high' ? 'primary' : 'default'}
            variant={filters.waterNeeds === 'high' ? 'filled' : 'outlined'}
            sx={{ flexShrink: 0 }}
          />
        </Box>
      </Box>

      {/* Special Attributes */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Special Attributes
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'nowrap',
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': {
              height: 6
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: 3
            }
          }}
        >
          <Chip
            label="Native"
            onClick={() => toggleSpecialAttribute('native')}
            color={filters.specialAttributes.includes('native') ? 'success' : 'default'}
            variant={filters.specialAttributes.includes('native') ? 'filled' : 'outlined'}
            sx={{ flexShrink: 0 }}
          />
          <Chip
            label="Pollinator"
            onClick={() => toggleSpecialAttribute('pollinator')}
            color={filters.specialAttributes.includes('pollinator') ? 'info' : 'default'}
            variant={filters.specialAttributes.includes('pollinator') ? 'filled' : 'outlined'}
            sx={{ flexShrink: 0 }}
          />
          <Chip
            label="Toxic"
            onClick={() => toggleSpecialAttribute('toxic')}
            color={filters.specialAttributes.includes('toxic') ? 'error' : 'default'}
            variant={filters.specialAttributes.includes('toxic') ? 'filled' : 'outlined'}
            sx={{ flexShrink: 0 }}
          />
          <Chip
            label="Non-Toxic"
            onClick={() => toggleSpecialAttribute('non-toxic')}
            color={filters.specialAttributes.includes('non-toxic') ? 'success' : 'default'}
            variant={filters.specialAttributes.includes('non-toxic') ? 'filled' : 'outlined'}
            sx={{ flexShrink: 0 }}
          />
          <Chip
            label="Beginner-Friendly"
            onClick={() => toggleSpecialAttribute('beginner-friendly')}
            color={filters.specialAttributes.includes('beginner-friendly') ? 'primary' : 'default'}
            variant={filters.specialAttributes.includes('beginner-friendly') ? 'filled' : 'outlined'}
            sx={{ flexShrink: 0 }}
          />
        </Box>
      </Box>

      {/* Plant Types */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Plant Type
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'nowrap',
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': {
              height: 6
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: 3
            }
          }}
        >
          <Chip
            label="Perennial"
            onClick={() => togglePlantType('perennial')}
            color={filters.plantTypes.includes('perennial') ? 'primary' : 'default'}
            variant={filters.plantTypes.includes('perennial') ? 'filled' : 'outlined'}
            sx={{ flexShrink: 0 }}
          />
          <Chip
            label="Annual"
            onClick={() => togglePlantType('annual')}
            color={filters.plantTypes.includes('annual') ? 'primary' : 'default'}
            variant={filters.plantTypes.includes('annual') ? 'filled' : 'outlined'}
            sx={{ flexShrink: 0 }}
          />
          <Chip
            label="Shrub"
            onClick={() => togglePlantType('shrub')}
            color={filters.plantTypes.includes('shrub') ? 'primary' : 'default'}
            variant={filters.plantTypes.includes('shrub') ? 'filled' : 'outlined'}
            sx={{ flexShrink: 0 }}
          />
          <Chip
            label="Tree"
            onClick={() => togglePlantType('tree')}
            color={filters.plantTypes.includes('tree') ? 'primary' : 'default'}
            variant={filters.plantTypes.includes('tree') ? 'filled' : 'outlined'}
            sx={{ flexShrink: 0 }}
          />
          <Chip
            label="Vine"
            onClick={() => togglePlantType('vine')}
            color={filters.plantTypes.includes('vine') ? 'primary' : 'default'}
            variant={filters.plantTypes.includes('vine') ? 'filled' : 'outlined'}
            sx={{ flexShrink: 0 }}
          />
          <Chip
            label="Grass"
            onClick={() => togglePlantType('grass')}
            color={filters.plantTypes.includes('grass') ? 'primary' : 'default'}
            variant={filters.plantTypes.includes('grass') ? 'filled' : 'outlined'}
            sx={{ flexShrink: 0 }}
          />
          <Chip
            label="Herb"
            onClick={() => togglePlantType('herb')}
            color={filters.plantTypes.includes('herb') ? 'primary' : 'default'}
            variant={filters.plantTypes.includes('herb') ? 'filled' : 'outlined'}
            sx={{ flexShrink: 0 }}
          />
        </Box>
      </Box>
    </Box>
  );
}
