'use client';

import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Paper,
  
  Button,
  Divider,
  Alert,
  Link as MuiLink,
  Grid,
} from "@mui/material";
} from "@mui/material";
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import BugReportIcon from '@mui/icons-material/BugReport';
import WarningIcon from '@mui/icons-material/Warning';
import StarIcon from '@mui/icons-material/Star';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Image from 'next/image';
import { Plant } from '@/types/plant';

interface PlantDetailProps {
  plant: Plant;
  onAddToShoppingList?: () => void;
}

export default function PlantDetail({ plant, onAddToShoppingList }: PlantDetailProps) {
  const getSoilPhDescription = () => {
    if (!plant.soilPhRange) return null;
    const { min, max } = plant.soilPhRange;
    let description = `${min}–${max}`;

    if (max < 6.5) description += ' (acidic)';
    else if (min > 7.5) description += ' (alkaline)';
    else if (min >= 6.5 && max <= 7.5) description += ' (neutral)';
    else description += ' (slightly acidic to neutral)';

    return description;
  };

  return (
    <Box>
      {/* Hero Section */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: 300, md: 400 },
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Image
              src={plant.imageUrl || 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f'}
              alt={plant.commonName}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={7}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
            {plant.commonName}
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontStyle: 'italic', mb: 3 }}
          >
            {plant.scientificName}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {plant.isNative && (
              <Chip
                label="Native"
                color="success"
                icon={<LocalFloristIcon />}
              />
            )}
            {plant.isPollinatorFriendly && (
              <Chip
                label="Pollinator-Friendly"
                color="info"
                icon={<BugReportIcon />}
              />
            )}
            {plant.toxicityToPets === 'toxic' && (
              <Chip
                label="Toxic to Pets"
                color="error"
                icon={<WarningIcon />}
              />
            )}
            {plant.toxicityToPets === 'non-toxic' && (
              <Chip
                label="Pet Safe"
                color="success"
              />
            )}
            {plant.beginnerFriendly && (
              <Chip
                label="Beginner-Friendly"
                color="primary"
                icon={<StarIcon />}
              />
            )}
          </Box>

          {plant.toxicityToPets === 'toxic' && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              This plant is toxic to pets if ingested. Keep away from cats, dogs, and other animals.
              {plant.aspcaUrl && (
                <>
                  {' '}
                  <MuiLink
                    href={plant.aspcaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="inherit"
                    underline="always"
                  >
                    Learn more from ASPCA
                  </MuiLink>
                </>
              )}
            </Alert>
          )}

          {plant.description && (
            <Typography variant="body1" paragraph>
              {plant.description}
            </Typography>
          )}

          <Button
            variant="contained"
            size="large"
            startIcon={<AddShoppingCartIcon />}
            onClick={onAddToShoppingList}
            sx={{ mt: 2 }}
          >
            Add to Shopping List
          </Button>
        </Grid>
      </Grid>

      {/* Key Details Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Key Details
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {plant.zoneMin && plant.zoneMax && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                USDA Hardiness Zones
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {plant.zoneMin}–{plant.zoneMax}
              </Typography>
            </Grid>
          )}

          {plant.sunExposure && plant.sunExposure.length > 0 && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                <WbSunnyIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                Sun Exposure
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {plant.sunExposure
                  .map((s) => s.replace('-', ' '))
                  .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                  .join(', ')}
              </Typography>
            </Grid>
          )}

          {plant.waterNeeds && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                <WaterDropIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                Water Needs
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {plant.waterNeeds.charAt(0).toUpperCase() + plant.waterNeeds.slice(1)}
              </Typography>
            </Grid>
          )}

          {plant.plantType && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Plant Type
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {plant.plantType.charAt(0).toUpperCase() + plant.plantType.slice(1)}
              </Typography>
            </Grid>
          )}

          {plant.bloomPeriod && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Bloom Period
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {plant.bloomPeriod}
              </Typography>
            </Grid>
          )}

          {plant.soilPhRange && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Soil pH
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {getSoilPhDescription()}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Planting & Spacing */}
      {(plant.spacingInches || plant.plantingDepthInches) && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            Planting & Spacing
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {plant.spacingInches && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Spacing
                </Typography>
                <Typography variant="body1">
                  {plant.spacingInches} inches apart
                </Typography>
              </Grid>
            )}

            {plant.plantingDepthInches && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Planting Depth
                </Typography>
                <Typography variant="body1">
                  {plant.plantingDepthInches} inches deep
                </Typography>
              </Grid>
            )}
          </Grid>

          {plant.notes && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">{plant.notes}</Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* Wildlife & Ecology */}
      {(plant.isPollinatorFriendly || plant.pollinators || plant.suggestedUse) && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            Wildlife & Ecology
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {plant.pollinators && plant.pollinators.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Attracts
              </Typography>
              <Typography variant="body1">{plant.pollinators.join(', ')}</Typography>
            </Box>
          )}

          {plant.suggestedUse && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Suggested Use
              </Typography>
              <Typography variant="body1">{plant.suggestedUse}</Typography>
            </Box>
          )}

          {plant.isNative && (
            <Alert severity="info" sx={{ mt: 2 }}>
              As a native plant, this species supports local ecosystems and requires less
              maintenance once established.
            </Alert>
          )}
        </Paper>
      )}
    </Box>
  );
}
