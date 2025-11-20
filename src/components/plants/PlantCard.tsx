'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  CardActions,
} from '@mui/material';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import BugReportIcon from '@mui/icons-material/BugReport';
import WarningIcon from '@mui/icons-material/Warning';
import StarIcon from '@mui/icons-material/Star';
import Link from 'next/link';
import { Plant } from '@/types/plant';

interface PlantCardProps {
  plant: Plant;
}

export default function PlantCard({ plant }: PlantCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        minHeight: 480,
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        },
      }}
    >
      <CardMedia
        component="img"
        image={plant.imageUrl || 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f'}
        alt={plant.commonName}
        sx={{
          objectFit: 'cover',
          height: 220,
          width: '100%',
          aspectRatio: '16/9',
          flexShrink: 0
        }}
      />
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          pb: 1,
          minHeight: 200
        }}
      >
        <Box>
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{
              minHeight: 64,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {plant.commonName}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontStyle: 'italic',
              mb: 2,
              minHeight: 40,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {plant.scientificName}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1, minHeight: 56 }}>
            {plant.isNative && (
              <Chip
                label="Native"
                size="small"
                color="success"
                icon={<LocalFloristIcon />}
                sx={{ fontSize: '0.75rem' }}
              />
            )}
            {plant.isPollinatorFriendly && (
              <Chip
                label="Pollinator"
                size="small"
                color="info"
                icon={<BugReportIcon />}
                sx={{ fontSize: '0.75rem' }}
              />
            )}
            {plant.toxicityToPets === 'toxic' && (
              <Chip
                label="Toxic to Pets"
                size="small"
                color="error"
                icon={<WarningIcon />}
                sx={{ fontSize: '0.75rem' }}
              />
            )}
            {plant.beginnerFriendly && (
              <Chip
                label="Beginner"
                size="small"
                color="primary"
                icon={<StarIcon />}
                sx={{ fontSize: '0.75rem' }}
              />
            )}
          </Box>
        </Box>

        {plant.zoneMin && plant.zoneMax && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Zones {plant.zoneMin}–{plant.zoneMax}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Button
          component={Link}
          href={`/plants/${plant.id}`}
          variant="contained"
          fullWidth
          size="small"
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}
