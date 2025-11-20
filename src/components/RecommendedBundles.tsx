'use client';

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip
} from '@mui/material';
import Link from 'next/link';
import { PlantBundle } from '@/lib/recommendations';
import PlantCard from '@/components/plants/PlantCard';

interface RecommendedBundlesProps {
  bundles: PlantBundle[];
  zone: number;
  showAllPlants?: boolean;
  maxBundles?: number;
}

export default function RecommendedBundles({
  bundles,
  zone,
  showAllPlants = false,
  maxBundles = 3
}: RecommendedBundlesProps) {
  const displayBundles = bundles.slice(0, maxBundles);

  if (displayBundles.length === 0) {
    return null;
  }

  return (
    <Box>
      {displayBundles.map((bundle) => (
        <Card key={bundle.id} sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              {bundle.name}
            </Typography>

            <Typography variant="body1" color="text.secondary" paragraph>
              {bundle.description}
            </Typography>

            {bundle.criteria.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                  Selection Criteria:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {bundle.criteria.map((criterion, index) => (
                    <Chip
                      key={index}
                      label={criterion}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {showAllPlants ? (
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {bundle.plants.map((plant) => (
                  <Grid item xs={12} sm={6} md={4} key={plant.id}>
                    <PlantCard plant={plant} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <>
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  Includes {bundle.plants.length} plants:
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    pl: 2,
                    m: 0,
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 0.5
                  }}
                >
                  {bundle.plants.slice(0, 6).map((plant) => (
                    <Typography
                      component="li"
                      key={plant.id}
                      variant="body2"
                      color="text.secondary"
                    >
                      {plant.commonName}
                      {plant.isNative && ' 🌿'}
                      {plant.isPollinatorFriendly && ' 🦋'}
                    </Typography>
                  ))}
                  {bundle.plants.length > 6 && (
                    <Typography
                      component="li"
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontStyle: 'italic' }}
                    >
                      + {bundle.plants.length - 6} more
                    </Typography>
                  )}
                </Box>
              </>
            )}

            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                component={Link}
                href={`/recommended?bundle=${bundle.id}&zone=${zone}`}
                variant="contained"
                size="small"
              >
                View Full Bundle
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
