'use client';

import React, { useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClientLayout from '@/components/layout/ClientLayout';
import PlantCard from '@/components/plants/PlantCard';
import {
  getPollinatorGardenPack,
  getNativeGardenPack,
  getShadeGardenPack,
  getLowWaterGardenPack,
  getFullSunGardenPack
} from '@/lib/recommendations';

// Recipe metadata
const recipeDetails: Record<string, any> = {
  'midwest-prairie': {
    name: 'Midwest Prairie Bed',
    description: 'Recreate a native prairie ecosystem with this drought-tolerant, pollinator-friendly collection.',
    sun: 'Full Sun',
    water: 'Low',
    seasonalInterest: 'Spring through Fall',
    getBundleFn: (zone: number) => getFullSunGardenPack(zone),
    layout: `
┌─────────────────────────────────┐
│    Tall Prairie Grasses         │
│                                 │
├─────────────────────────────────┤
│  Coneflowers    Black-Eyed Susan│
│                                 │
├─────────────────────────────────┤
│    Groundcovers & Low Plants    │
└─────────────────────────────────┘
    `,
    tips: [
      'Plant in full sun for best results',
      'Water regularly the first year to establish roots',
      'Once established, requires minimal watering',
      'Cut back in late winter for spring growth',
      'Provides year-round visual interest'
    ]
  },
  'shade-sanctuary': {
    name: 'Shade Sanctuary Bed',
    description: 'Transform shady areas into lush, vibrant spaces with these shade-loving plants.',
    sun: 'Shade',
    water: 'Medium',
    seasonalInterest: 'Spring through Summer',
    getBundleFn: (zone: number) => getShadeGardenPack(zone),
    layout: `
┌─────────────────────────────────┐
│      Tall Ferns & Hostas        │
│                                 │
├─────────────────────────────────┤
│   Medium Height Shade Perennials│
│                                 │
├─────────────────────────────────┤
│    Groundcovers & Low Plants    │
└─────────────────────────────────┘
    `,
    tips: [
      'Ideal for north-facing areas or under trees',
      'Maintain consistent moisture',
      'Mulch to retain moisture and suppress weeds',
      'Divide perennials every 3-4 years',
      'Add compost annually for nutrients'
    ]
  },
  'pollinator-highway': {
    name: 'Pollinator Highway',
    description: 'Create a buzzing corridor for bees, butterflies, and hummingbirds.',
    sun: 'Full Sun to Part Sun',
    water: 'Low to Medium',
    seasonalInterest: 'All Season',
    getBundleFn: (zone: number) => getPollinatorGardenPack(zone),
    layout: `
┌─────────────────────────────────┐
│  Tall Flowers (Back)            │
│                                 │
├─────────────────────────────────┤
│  Medium Flowers (Middle)        │
│                                 │
├─────────────────────────────────┤
│  Low Flowers (Front)            │
└─────────────────────────────────┘
    `,
    tips: [
      'Plant in groups of 3-5 for visual impact',
      'Choose plants with staggered bloom times',
      'Avoid pesticides to protect pollinators',
      'Provide a water source nearby',
      'Deadhead spent blooms to encourage more flowers'
    ]
  },
  'rain-garden': {
    name: 'Rain Garden Basin',
    description: 'Handle stormwater runoff with these water-loving native plants.',
    sun: 'Part Sun',
    water: 'High',
    seasonalInterest: 'Summer',
    getBundleFn: (zone: number) => getNativeGardenPack(zone),
    layout: `
┌─────────────────────────────────┐
│   Center: Wetland Loving Plants │
│                                 │
├─────────────────────────────────┤
│  Middle Ring: Moderate Moisture │
│                                 │
├─────────────────────────────────┤
│  Outer Ring: Drier Edge Plants  │
└─────────────────────────────────┘
    `,
    tips: [
      'Place in low spot to collect runoff',
      'Dig 6-12 inches deep basin',
      'Use native plants adapted to moisture variation',
      'Mulch edges but not center',
      'Allow 12-48 hours for water to drain'
    ]
  },
  'dry-rock-garden': {
    name: 'Dry Rock Garden',
    description: 'Perfect for hot, dry spots with these drought-tolerant plants.',
    sun: 'Full Sun',
    water: 'Low',
    seasonalInterest: 'Spring through Fall',
    getBundleFn: (zone: number) => getLowWaterGardenPack(zone),
    layout: `
┌─────────────────────────────────┐
│  Accent Rocks & Tall Plants     │
│                                 │
├─────────────────────────────────┤
│  Medium Grasses & Flowers       │
│                                 │
├─────────────────────────────────┤
│  Low Groundcovers & Sedums      │
└─────────────────────────────────┘
    `,
    tips: [
      'Use gravel or stone mulch',
      'Ensure excellent drainage',
      'Water deeply but infrequently',
      'Avoid fertilizing drought-tolerant plants',
      'Perfect for slopes and rocky areas'
    ]
  },
  'herb-pollinator-mix': {
    name: 'Herb & Pollinator Mix',
    description: 'Combine culinary herbs with pollinator-friendly flowers.',
    sun: 'Full Sun',
    water: 'Low to Medium',
    seasonalInterest: 'All Season',
    getBundleFn: (zone: number) => getPollinatorGardenPack(zone),
    layout: `
┌─────────────────────────────────┐
│  Tall: Dill, Fennel, Bee Balm   │
│                                 │
├─────────────────────────────────┤
│  Medium: Basil, Sage, Echinacea │
│                                 │
├─────────────────────────────────┤
│  Low: Thyme, Oregano, Flowers   │
└─────────────────────────────────┘
    `,
    tips: [
      'Harvest herbs regularly for bushier growth',
      'Let some herbs flower for pollinators',
      'Avoid pesticides on edible plants',
      'Water herbs moderately',
      'Plant perennial herbs on one side for easier maintenance'
    ]
  }
};

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const zone = 5; // Default zone, could be made dynamic

  const recipe = recipeDetails[id];
  const bundle = useMemo(() => {
    return recipe?.getBundleFn(zone);
  }, [recipe, zone]);

  if (!recipe || !bundle) {
    return (
      <ClientLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error">Recipe not found</Alert>
        </Container>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/recipes')}
          sx={{ mb: 3 }}
        >
          Back to Recipes
        </Button>

        <Typography variant="h3" gutterBottom fontWeight={700}>
          {recipe.name}
        </Typography>

        <Typography variant="h6" color="text.secondary" paragraph>
          {recipe.description}
        </Typography>

        {/* Overview */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Overview
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Sun
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {recipe.sun}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Water
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {recipe.water}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Seasonal Interest
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {recipe.seasonalInterest}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Plant Count
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {bundle.plants.length} plants
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Layout Sketch */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Layout Sketch
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
              <Typography
                component="pre"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  overflow: 'auto',
                  m: 0
                }}
              >
                {recipe.layout}
              </Typography>
            </Paper>
          </CardContent>
        </Card>

        {/* Recommended Plants */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Recommended Plants ({bundle.plants.length})
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              {bundle.plants.map((plant) => (
                <Grid item xs={12} sm={6} md={4} key={plant.id}>
                  <PlantCard plant={plant} />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Planting Tips */}
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Planting & Care Tips
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <List>
              {recipe.tips.map((tip: string, index: number) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={tip}
                    primaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Container>
    </ClientLayout>
  );
}
