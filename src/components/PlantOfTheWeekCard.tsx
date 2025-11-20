'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import Link from 'next/link';
import { Plant } from '@/types/plant';
import { getSelectionReasons } from '@/lib/plantOfTheWeek';

interface PlantOfTheWeekCardProps {
  plant: Plant;
  zone?: number;
}

export default function PlantOfTheWeekCard({ plant, zone }: PlantOfTheWeekCardProps) {
  const reasons = getSelectionReasons(plant);

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: { xs: '100%', sm: 200 },
          height: { xs: 200, sm: 'auto' },
          objectFit: 'cover'
        }}
        image={plant.imageUrl || 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f'}
        alt={plant.commonName}
      />
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Chip
            icon={<StarIcon />}
            label="Plant of the Week"
            color="warning"
            size="small"
            sx={{ fontWeight: 600 }}
          />
          {zone && plant.zoneMin && plant.zoneMax && (
            <Chip
              label={`Zone ${zone}`}
              size="small"
              color="success"
            />
          )}
        </Box>

        <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
          {plant.commonName}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: 'italic', mb: 2 }}
        >
          {plant.scientificName}
        </Typography>

        {reasons.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              Why this week:
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              {reasons.slice(0, 3).map((reason, index) => (
                <Typography
                  component="li"
                  key={index}
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  {reason}
                </Typography>
              ))}
            </Box>
          </Box>
        )}

        <Button
          component={Link}
          href={`/plants/${plant.id}`}
          variant="contained"
          size="small"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
