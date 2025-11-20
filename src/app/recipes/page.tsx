'use client';

import React from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip
} from '@mui/material';
import { useRouter } from 'next/navigation';
import ClientLayout from '@/components/layout/ClientLayout';

const recipes = [
  {
    id: 'midwest-prairie',
    name: 'Midwest Prairie Bed',
    description: 'Recreate a native prairie ecosystem with this drought-tolerant, pollinator-friendly collection perfect for full sun locations.',
    sun: 'Full Sun',
    water: 'Low',
    seasonalInterest: 'Spring through Fall',
    plantCount: 8
  },
  {
    id: 'shade-sanctuary',
    name: 'Shade Sanctuary Bed',
    description: 'Transform shady areas into lush, vibrant spaces with these shade-loving native plants that thrive in low-light conditions.',
    sun: 'Shade',
    water: 'Medium',
    seasonalInterest: 'Spring through Summer',
    plantCount: 10
  },
  {
    id: 'pollinator-highway',
    name: 'Pollinator Highway',
    description: 'Create a buzzing corridor for bees, butterflies, and hummingbirds with continuous blooms from spring through fall.',
    sun: 'Full Sun to Part Sun',
    water: 'Low to Medium',
    seasonalInterest: 'All Season',
    plantCount: 12
  },
  {
    id: 'rain-garden',
    name: 'Rain Garden Basin',
    description: 'Handle stormwater runoff beautifully with these water-loving native plants that filter and absorb excess moisture.',
    sun: 'Part Sun',
    water: 'High',
    seasonalInterest: 'Summer',
    plantCount: 9
  },
  {
    id: 'dry-rock-garden',
    name: 'Dry Rock Garden',
    description: 'Perfect for hot, dry spots with poor soil. These tough plants add color and texture while requiring minimal watering.',
    sun: 'Full Sun',
    water: 'Low',
    seasonalInterest: 'Spring through Fall',
    plantCount: 10
  },
  {
    id: 'herb-pollinator-mix',
    name: 'Herb & Pollinator Mix',
    description: 'Combine culinary herbs with pollinator-friendly flowers for a productive and beautiful garden that serves multiple purposes.',
    sun: 'Full Sun',
    water: 'Low to Medium',
    seasonalInterest: 'All Season',
    plantCount: 8
  }
];

export default function RecipesPage() {
  const router = useRouter();

  return (
    <ClientLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom fontWeight={700}>
          Garden Recipes
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Pre-designed plant combinations for beautiful, sustainable gardens
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 800 }}>
          Each recipe provides a curated list of plants that work together to create cohesive, low-maintenance gardens.
          Select a recipe to see the full planting plan, plant list, and care instructions.
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {recipes.map((recipe) => (
            <Grid item xs={12} md={6} key={recipe.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    {recipe.name}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    <Chip label={recipe.sun} size="small" color="warning" variant="outlined" />
                    <Chip label={recipe.water} size="small" color="info" variant="outlined" />
                    <Chip label={`${recipe.plantCount} plants`} size="small" variant="outlined" />
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {recipe.description}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    <strong>Seasonal Interest:</strong> {recipe.seasonalInterest}
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => router.push(`/recipes/${recipe.id}`)}
                  >
                    View Recipe
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ClientLayout>
  );
}
