'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, CircularProgress, Alert, Button } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClientLayout from '@/components/layout/ClientLayout';
import PlantDetail from '@/components/plants/PlantDetail';
import { Plant } from '@/types/plant';
import { getPlantById } from '@/lib/plants';
import { addToShoppingList } from '@/lib/shopping-list';

export default function PlantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToList, setAddedToList] = useState(false);

  useEffect(() => {
    const loadPlant = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const plantData = await getPlantById(id);
        if (plantData) {
          setPlant(plantData);
        } else {
          setError('Plant not found');
        }
      } catch (err) {
        setError('Failed to load plant details');
      } finally {
        setLoading(false);
      }
    };

    loadPlant();
  }, [id]);

  const handleAddToShoppingList = () => {
    if (!plant) return;

    addToShoppingList(plant.id, plant.commonName);
    setAddedToList(true);

    // Dispatch custom event to update shopping list count
    window.dispatchEvent(new Event('shoppingListUpdated'));

    // Reset the notification after 3 seconds
    setTimeout(() => setAddedToList(false), 3000);
  };

  return (
    <ClientLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{ mb: 3 }}
        >
          Back to Browse
        </Button>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : plant ? (
          <>
            {addedToList && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {plant.commonName} added to your shopping list!
              </Alert>
            )}
            <PlantDetail plant={plant} onAddToShoppingList={handleAddToShoppingList} />
          </>
        ) : null}
      </Container>
    </ClientLayout>
  );
}
