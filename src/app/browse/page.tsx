'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";

import { useSearchParams } from 'next/navigation';
import ClientLayout from '@/components/layout/ClientLayout';
import PlantCard from '@/components/plants/PlantCard';
import PlantFilters from '@/components/plants/PlantFilters';
import { Plant, PlantFilters as PlantFiltersType } from '@/types/plant';
import { getAllPlants, getCuratedPlantsForZone, filterPlants } from '@/lib/plants';

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const zone = searchParams?.get('zone');
  const zoneDisplay = searchParams?.get('zoneDisplay');

  const [plants, setPlants] = useState<Plant[]>([]);
  const [curatedPlants, setCuratedPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PlantFiltersType>({
    zone: zone ? parseInt(zone) : undefined,
  });

  useEffect(() => {
    const loadPlants = async () => {
      setLoading(true);
      try {
        const zoneNum = zone ? parseInt(zone) : undefined;

        // Load all plants for the zone
        const allPlants = await getAllPlants({ zone: zoneNum });
        setPlants(allPlants);

        // Load curated starter plants if zone is specified
        if (zoneNum) {
          const curated = await getCuratedPlantsForZone(zoneNum);
          setCuratedPlants(curated);
        }
      } catch (error) {
        console.error('Error loading plants:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlants();
  }, [zone]);

  const filteredPlants = filterPlants(plants, filters);

  return (
    <ClientLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom fontWeight={700}>
          Browse Plants
        </Typography>

        {zone && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Showing plants suitable for Zone {zoneDisplay || zone}. Always double-check with local
            conditions and consult your local extension service for specific recommendations.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Filters Sidebar */}
          <Grid item xs={12} md={3}>
            <PlantFilters
              filters={filters}
              zone={zone ? parseInt(zone) : undefined}
              onChange={setFilters}
            />
          </Grid>

          {/* Plant Grid */}
          <Grid item xs={12} md={9}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {/* Curated Starters */}
                {curatedPlants.length > 0 && (
                  <Box sx={{ mb: 6 }}>
                    <Typography variant="h5" gutterBottom fontWeight={600}>
                      Recommended Starters for Your Zone
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      These beginner-friendly plants are specially curated for Zone {zone}
                    </Typography>
                    <Grid container spacing={3}>
                      {curatedPlants.map((plant) => (
                        <Grid item xs={12} sm={6} md={4} key={plant.id}>
                          <PlantCard plant={plant} />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* All Matching Plants */}
                <Box>
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    {curatedPlants.length > 0 ? 'All Matching Plants' : 'Plants'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {filteredPlants.length} plant{filteredPlants.length !== 1 ? 's' : ''} found
                  </Typography>

                  {filteredPlants.length === 0 ? (
                    <Alert severity="warning">
                      No plants match your current filters. Try adjusting your criteria.
                    </Alert>
                  ) : (
                    <Grid container spacing={3}>
                      {filteredPlants.map((plant) => (
                        <Grid item xs={12} sm={6} md={4} key={plant.id}>
                          <PlantCard plant={plant} />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </ClientLayout>
  );
}
