'use client';

import React, { Suspense, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Grid,
  Alert
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import ClientLayout from '@/components/layout/ClientLayout';
import PlantCard from '@/components/plants/PlantCard';
import RecommendedBundles from '@/components/RecommendedBundles';
import { getAllBundles } from '@/lib/recommendations';

function RecommendedPageContent() {
  const searchParams = useSearchParams();
  const zone = searchParams?.get('zone');
  const bundleId = searchParams?.get('bundle');
  const zoneNum = zone ? parseInt(zone) : 5; // Default to zone 5

  // Get all bundles for the zone
  const bundles = useMemo(() => getAllBundles(zoneNum), [zoneNum]);

  // If a specific bundle is requested, show only that one
  const selectedBundle = bundleId
    ? bundles.find(b => b.id === bundleId)
    : null;

  return (
    <ClientLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {selectedBundle ? (
          // Show specific bundle
          <>
            <Typography variant="h3" gutterBottom fontWeight={700}>
              {selectedBundle.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Zone {zoneNum}
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              {selectedBundle.description}
            </Alert>

            <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mt: 4 }}>
              Plants in this Bundle ({selectedBundle.plants.length})
            </Typography>

            <Grid container spacing={3} sx={{ mt: 1 }}>
              {selectedBundle.plants.map((plant) => (
                <Grid item xs={12} sm={6} md={4} key={plant.id}>
                  <PlantCard plant={plant} />
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          // Show all bundles
          <>
            <Typography variant="h3" gutterBottom fontWeight={700}>
              Recommended Plant Collections
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Curated bundles for Zone {zoneNum}
            </Typography>

            <Alert severity="info" sx={{ mb: 4 }}>
              These curated plant collections are designed to work together, creating beautiful and sustainable gardens. Each bundle is tailored for Zone {zoneNum}.
            </Alert>

            <RecommendedBundles
              bundles={bundles}
              zone={zoneNum}
              showAllPlants={false}
              maxBundles={10}
            />

            {bundles.length === 0 && (
              <Alert severity="warning" sx={{ mt: 3 }}>
                No plant bundles are currently available for Zone {zoneNum}. Please try a different zone or browse all plants.
              </Alert>
            )}
          </>
        )}
      </Container>
    </ClientLayout>
  );
}

export default function RecommendedPage() {
  return (
    <Suspense fallback={
      <ClientLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </ClientLayout>
    }>
      <RecommendedPageContent />
    </Suspense>
  );
}
