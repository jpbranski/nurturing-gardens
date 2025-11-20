'use client';

import React from 'react';
import { Box, Chip, Typography, Button } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
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
  const hasActiveFilters =
    filters.sunExposure.length > 0 ||
    filters.waterNeeds !== null ||
    filters.specialAttributes.length > 0 ||
    filters.plantTypes.length > 0;

  const clearAllFilters = () => {
    onChange({
      sunExposure: [],
      waterNeeds: null,
      specialAttributes: [],
      plantTypes: []
    });
  };
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
      {/* Header with Clear All button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          Filters
        </Typography>
        {hasActiveFilters && (
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={clearAllFilters}
            sx={{ textTransform: 'none', fontSize: '0.8125rem' }}
          >
            Clear All
          </Button>
        )}
      </Box>

      {/* Sun Exposure */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 600, display: 'block', color: 'text.secondary' }}>
          Sun Exposure
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 0.75,
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          <Chip
            label="Full Sun"
            onClick={() => toggleSunExposure('full-sun')}
            color={filters.sunExposure.includes('full-sun') ? 'primary' : 'default'}
            variant={filters.sunExposure.includes('full-sun') ? 'filled' : 'outlined'}
            size="small"
          />
          <Chip
            label="Part Sun"
            onClick={() => toggleSunExposure('part-sun')}
            color={filters.sunExposure.includes('part-sun') ? 'primary' : 'default'}
            variant={filters.sunExposure.includes('part-sun') ? 'filled' : 'outlined'}
            size="small"
          />
          <Chip
            label="Shade"
            onClick={() => toggleSunExposure('shade')}
            color={filters.sunExposure.includes('shade') ? 'primary' : 'default'}
            variant={filters.sunExposure.includes('shade') ? 'filled' : 'outlined'}
            size="small"
          />
        </Box>
      </Box>

      {/* Water Needs */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 600, display: 'block', color: 'text.secondary' }}>
          Water Needs
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 0.75,
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          <Chip
            label="Low"
            onClick={() => toggleWaterNeeds('low')}
            color={filters.waterNeeds === 'low' ? 'primary' : 'default'}
            variant={filters.waterNeeds === 'low' ? 'filled' : 'outlined'}
            size="small"
          />
          <Chip
            label="Medium"
            onClick={() => toggleWaterNeeds('medium')}
            color={filters.waterNeeds === 'medium' ? 'primary' : 'default'}
            variant={filters.waterNeeds === 'medium' ? 'filled' : 'outlined'}
            size="small"
          />
          <Chip
            label="High"
            onClick={() => toggleWaterNeeds('high')}
            color={filters.waterNeeds === 'high' ? 'primary' : 'default'}
            variant={filters.waterNeeds === 'high' ? 'filled' : 'outlined'}
            size="small"
          />
        </Box>
      </Box>

      {/* Special Attributes */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 600, display: 'block', color: 'text.secondary' }}>
          Special Attributes
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 0.75,
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          <Chip
            label="Native"
            onClick={() => toggleSpecialAttribute('native')}
            color={filters.specialAttributes.includes('native') ? 'success' : 'default'}
            variant={filters.specialAttributes.includes('native') ? 'filled' : 'outlined'}
            size="small"
          />
          <Chip
            label="Pollinator"
            onClick={() => toggleSpecialAttribute('pollinator')}
            color={filters.specialAttributes.includes('pollinator') ? 'info' : 'default'}
            variant={filters.specialAttributes.includes('pollinator') ? 'filled' : 'outlined'}
            size="small"
          />
          <Chip
            label="Toxic"
            onClick={() => toggleSpecialAttribute('toxic')}
            color={filters.specialAttributes.includes('toxic') ? 'error' : 'default'}
            variant={filters.specialAttributes.includes('toxic') ? 'filled' : 'outlined'}
            size="small"
          />
          <Chip
            label="Non-Toxic"
            onClick={() => toggleSpecialAttribute('non-toxic')}
            color={filters.specialAttributes.includes('non-toxic') ? 'success' : 'default'}
            variant={filters.specialAttributes.includes('non-toxic') ? 'filled' : 'outlined'}
            size="small"
          />
          <Chip
            label="Beginner-Friendly"
            onClick={() => toggleSpecialAttribute('beginner-friendly')}
            color={filters.specialAttributes.includes('beginner-friendly') ? 'primary' : 'default'}
            variant={filters.specialAttributes.includes('beginner-friendly') ? 'filled' : 'outlined'}
            size="small"
          />
        </Box>
      </Box>

      {/* Plant Types */}
      <Box>
        <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 600, display: 'block', color: 'text.secondary' }}>
          Plant Type
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 0.75,
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          <Chip
            label="Perennial"
            onClick={() => togglePlantType('perennial')}
            color={filters.plantTypes.includes('perennial') ? 'primary' : 'default'}
            variant={filters.plantTypes.includes('perennial') ? 'filled' : 'outlined'}
            size="small"
          />
          <Chip
            label="Annual"
            onClick={() => togglePlantType('annual')}
            color={filters.plantTypes.includes('annual') ? 'primary' : 'default'}
            variant={filters.plantTypes.includes('annual') ? 'filled' : 'outlined'}
            size="small"
          />
          <Chip
            label="Shrub"
            onClick={() => togglePlantType('shrub')}
            color={filters.plantTypes.includes('shrub') ? 'primary' : 'default'}
            variant={filters.plantTypes.includes('shrub') ? 'filled' : 'outlined'}
            size="small"
          />
          <Chip
            label="Tree"
            onClick={() => togglePlantType('tree')}
            color={filters.plantTypes.includes('tree') ? 'primary' : 'default'}
            variant={filters.plantTypes.includes('tree') ? 'filled' : 'outlined'}
            size="small"
          />
          <Chip
            label="Vine"
            onClick={() => togglePlantType('vine')}
            color={filters.plantTypes.includes('vine') ? 'primary' : 'default'}
            variant={filters.plantTypes.includes('vine') ? 'filled' : 'outlined'}
            size="small"
          />
          <Chip
            label="Grass"
            onClick={() => togglePlantType('grass')}
            color={filters.plantTypes.includes('grass') ? 'primary' : 'default'}
            variant={filters.plantTypes.includes('grass') ? 'filled' : 'outlined'}
            size="small"
          />
          <Chip
            label="Herb"
            onClick={() => togglePlantType('herb')}
            color={filters.plantTypes.includes('herb') ? 'primary' : 'default'}
            variant={filters.plantTypes.includes('herb') ? 'filled' : 'outlined'}
            size="small"
          />
        </Box>
      </Box>
    </Box>
  );
}
