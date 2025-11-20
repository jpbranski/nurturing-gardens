'use client';

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Divider,
  Chip,
} from '@mui/material';
import { PlantFilters as PlantFiltersType, SunExposure, PlantType, WaterNeeds } from '@/types/plant';

interface PlantFiltersProps {
  filters: PlantFiltersType;
  zone?: number;
  onChange: (filters: PlantFiltersType) => void;
}

export default function PlantFilters({ filters, zone, onChange }: PlantFiltersProps) {
  const handleToggle = (field: keyof PlantFiltersType, value?: any) => {
    onChange({
      ...filters,
      [field]: value !== undefined ? value : !filters[field],
    });
  };

  const handleSunExposureToggle = (exposure: SunExposure) => {
    const current = filters.sunExposure || [];
    const updated = current.includes(exposure)
      ? current.filter((e) => e !== exposure)
      : [...current, exposure];
    onChange({ ...filters, sunExposure: updated.length > 0 ? updated : undefined });
  };

  const handlePlantTypeToggle = (type: PlantType) => {
    const current = filters.plantType || [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onChange({ ...filters, plantType: updated.length > 0 ? updated : undefined });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        Filters
      </Typography>

      {zone && (
        <Box sx={{ mb: 2 }}>
          <Chip label={`Zone ${zone}`} color="primary" />
          <Typography variant="caption" display="block" sx={{ mt: 1 }} color="text.secondary">
            Showing plants suitable for your zone
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.nativeOnly || false}
              onChange={() => handleToggle('nativeOnly')}
            />
          }
          label="Native plants only"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.pollinatorFriendlyOnly || false}
              onChange={() => handleToggle('pollinatorFriendlyOnly')}
            />
          }
          label="Pollinator-friendly only"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.excludeToxicToPets || false}
              onChange={() => handleToggle('excludeToxicToPets')}
            />
          }
          label="Exclude toxic to pets"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.beginnerFriendlyOnly || false}
              onChange={() => handleToggle('beginnerFriendlyOnly')}
            />
          }
          label="Beginner-friendly only"
        />
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" gutterBottom fontWeight={600}>
        Sun Exposure
      </Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={(filters.sunExposure || []).includes('full-sun')}
              onChange={() => handleSunExposureToggle('full-sun')}
            />
          }
          label="Full Sun"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={(filters.sunExposure || []).includes('part-sun')}
              onChange={() => handleSunExposureToggle('part-sun')}
            />
          }
          label="Partial Sun"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={(filters.sunExposure || []).includes('shade')}
              onChange={() => handleSunExposureToggle('shade')}
            />
          }
          label="Shade"
        />
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" gutterBottom fontWeight={600}>
        Plant Type
      </Typography>
      <FormGroup>
        {(['perennial', 'annual', 'shrub', 'tree', 'vine', 'herb'] as PlantType[]).map((type) => (
          <FormControlLabel
            key={type}
            control={
              <Checkbox
                checked={(filters.plantType || []).includes(type)}
                onChange={() => handlePlantTypeToggle(type)}
              />
            }
            label={type.charAt(0).toUpperCase() + type.slice(1)}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" gutterBottom fontWeight={600}>
        Water Needs
      </Typography>
      <FormGroup>
        {(['low', 'medium', 'high'] as WaterNeeds[]).map((need) => (
          <FormControlLabel
            key={need}
            control={
              <Checkbox
                checked={filters.waterNeeds === need}
                onChange={() =>
                  handleToggle('waterNeeds', filters.waterNeeds === need ? undefined : need)
                }
              />
            }
            label={need.charAt(0).toUpperCase() + need.slice(1)}
          />
        ))}
      </FormGroup>
    </Paper>
  );
}
