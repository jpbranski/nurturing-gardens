'use client';

import React from 'react';
import {
  Card,
  CardContent,
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
import Image from 'next/image';
import { Plant } from '@/types/plant';

interface PlantCardProps {
  plant: Plant;
}

export default function PlantCard({ plant }: PlantCardProps) {
  const defaultImage = 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f';
  const imageUrl = plant.imageUrl || defaultImage;

  return (
    <Card
      sx={{
        height: '100%',
        minHeight: 500,
        maxHeight: 500,
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: 220,
          width: '100%',
          flexShrink: 0,
          backgroundColor: 'grey.200'
        }}
      >
        <Image
          src={imageUrl}
          alt={`${plant.commonName} (${plant.scientificName}) - Photo showing typical appearance`}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, (max-width: 1280px) 33vw, 25vw"
          style={{ objectFit: 'cover' }}
          priority={false}
        />
      </Box>
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          pb: 1,
          minHeight: 220,
          maxHeight: 220,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{
              height: 56,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
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
              height: 40,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {plant.scientificName}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1, height: 60, alignContent: 'flex-start' }}>
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

        <Box sx={{ mt: 'auto' }}>
          {plant.zoneMin && plant.zoneMax && (
            <Typography variant="body2" color="text.secondary">
              Zones {plant.zoneMin}–{plant.zoneMax}
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0, height: 60, alignItems: 'center' }}>
        <Button
          component={Link}
          href={`/plants/${plant.id}`}
          variant="contained"
          fullWidth
          size="small"
          aria-label={`View details for ${plant.commonName}`}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}
