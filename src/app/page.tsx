'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  
  Paper,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import BugReportIcon from '@mui/icons-material/BugReport';
import PetsIcon from '@mui/icons-material/Pets';
import { useRouter } from 'next/navigation';
import ClientLayout from '@/components/layout/ClientLayout';
import PlantCard from '@/components/plants/PlantCard';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { getAllPlants } from '@/lib/plants';

export default function HomePage() {
  const [zip, setZip] = useState('');
  const [manualZone, setManualZone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // For demo purposes, show some featured plants from zone 5
  const [featuredPlants] = useState(() => {
    // This would normally be async, but for simplicity we'll use a mock
    return [
      {
        id: 'echinacea-purpurea',
        commonName: 'Purple Coneflower',
        scientificName: 'Echinacea purpurea',
        imageUrl: 'https://images.unsplash.com/photo-1597165171577-346229e51a45',
        isNative: true,
        isPollinatorFriendly: true,
        beginnerFriendly: true,
        toxicityToPets: 'non-toxic' as const,
      },
      {
        id: 'rudbeckia-hirta',
        commonName: 'Black-Eyed Susan',
        scientificName: 'Rudbeckia hirta',
        imageUrl: 'https://images.unsplash.com/photo-1595429973945-f0d3c80fc571',
        isNative: true,
        isPollinatorFriendly: true,
        beginnerFriendly: true,
        toxicityToPets: 'non-toxic' as const,
      },
      {
        id: 'asclepias-tuberosa',
        commonName: 'Butterfly Weed',
        scientificName: 'Asclepias tuberosa',
        imageUrl: 'https://images.unsplash.com/photo-1563207153-f403bf289096',
        isNative: true,
        isPollinatorFriendly: true,
        beginnerFriendly: true,
        toxicityToPets: 'toxic' as const,
      },
    ];
  });


  const recentPosts = [
    {
      slug: 'why-choose-native-plants',
      title: 'Why Choose Native Plants for Your Garden?',
      excerpt: 'Native plants are adapted to local conditions, require less maintenance, and support local ecosystems.',
      category: 'native' as const,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      coverImage: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f',
      author: 'Nurturing Gardens Team',
    },
    {
      slug: 'creating-pollinator-paradise',
      title: 'Creating a Pollinator Paradise in Your Backyard',
      excerpt: 'Discover how to transform your garden into a haven for bees, butterflies, and hummingbirds.',
      category: 'pollinators' as const,
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      coverImage: 'https://images.unsplash.com/photo-1568526381923-caf3fd520382',
      author: 'Nurturing Gardens Team',
    },
    {
      slug: 'plant-of-the-week-purple-coneflower',
      title: 'Plant of the Week: Purple Coneflower',
      excerpt: 'Meet the purple coneflower, a native powerhouse that attracts pollinators and survives drought.',
      category: 'plant-of-the-week' as const,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      coverImage: 'https://images.unsplash.com/photo-1597165171577-346229e51a45',
      author: 'Nurturing Gardens Team',
    },
  ];

  const handleZipSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/zone?zip=${zip}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to find zone for this ZIP code');
        setLoading(false);
        return;
      }

      router.push(`/browse?zone=${data.zoneNumber}&zoneDisplay=${data.zone}`);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualZone = () => {
    if (!manualZone) return;
    const zoneNum = parseInt(manualZone);
    if (isNaN(zoneNum) || zoneNum < 1 || zoneNum > 13) {
      setError('Please enter a valid zone (1-13)');
      return;
    }
    router.push(`/browse?zone=${zoneNum}`);
  };

  return (
    <ClientLayout>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'success.light',
          color: 'white',
          py: { xs: 6, md: 10 },
          backgroundImage: 'linear-gradient(135deg, #6b8e4e 0%, #5a7c3a 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            align="center"
            gutterBottom
            fontWeight={700}
            sx={{ mb: 2 }}
          >
            Grow the Right Plants for Your Climate
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ mb: 4, maxWidth: 700, mx: 'auto', opacity: 0.95 }}
          >
            Discover zone-appropriate plants with a focus on native species and pollinator support.
            Build your sustainable garden with confidence.
          </Typography>

          {/* ZIP Code Search */}
          <Paper
            component="form"
            onSubmit={handleZipSearch}
            sx={{
              p: 3,
              maxWidth: 500,
              mx: 'auto',
              mb: 3,
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Find Your Hardiness Zone
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Enter ZIP code"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                disabled={loading}
                inputProps={{ maxLength: 5 }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !zip}
                startIcon={<SearchIcon />}
                sx={{ flexShrink: 0 }}
              >
                {loading ? 'Searching...' : 'Find Zone'}
              </Button>
            </Box>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>

          {/* Manual Zone Selection */}
          <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
              Already know your zone?
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Select Zone</InputLabel>
                <Select
                  value={manualZone}
                  onChange={(e) => setManualZone(e.target.value)}
                  label="Select Zone"
                >
                  {Array.from({ length: 13 }, (_, i) => i + 1).map((zone) => (
                    <MenuItem key={zone} value={zone.toString()}>
                      Zone {zone}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                onClick={handleManualZone}
                disabled={!manualZone}
                sx={{ flexShrink: 0 }}
              >
                Browse
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Native & Pollinator Focus */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
          Why Nurturing Gardens?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <LocalFloristIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Native Plants
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Native plants are adapted to local conditions, require less maintenance, and
                support local ecosystems. They're the sustainable choice for your garden.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <BugReportIcon color="info" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Pollinator Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pollinators are essential for healthy ecosystems. We highlight plants that
                attract bees, butterflies, and hummingbirds to help you create a pollinator
                paradise.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <PetsIcon color="secondary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Pet Safety
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We clearly mark plants that may be toxic to pets, helping you make informed
                decisions to keep your furry friends safe while enjoying your garden.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Featured Plants */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Featured Plants
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Start your garden with these beginner-friendly native plants
          </Typography>
          <Grid container spacing={3}>
            {featuredPlants.map((plant) => (
              <Grid item xs={12} sm={6} md={4} key={plant.id}>
                <PlantCard plant={plant} />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button variant="contained" size="large" onClick={() => router.push('/browse')}>
              Browse All Plants
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Blog Teaser */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Latest from Our Blog
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Tips, guides, and inspiration for sustainable gardening
        </Typography>
        <Grid container spacing={3}>
          {recentPosts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.slug}>
              <BlogPostCard post={post} />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="outlined" size="large" onClick={() => router.push('/blog')}>
            View All Posts
          </Button>
        </Box>
      </Container>
    </ClientLayout>
  );
}
