'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  CircularProgress,
  Alert,
  Button,
  Typography,
  Paper,
  Chip,
  Grid,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link as MuiLink
} from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import BugReportIcon from '@mui/icons-material/BugReport';
import WarningIcon from '@mui/icons-material/Warning';
import StarIcon from '@mui/icons-material/Star';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Image from 'next/image';
import ClientLayout from '@/components/layout/ClientLayout';
import PlantCard from '@/components/plants/PlantCard';
import ZoneBadge from '@/components/ZoneBadge';
import PlantOfTheWeekCard from '@/components/PlantOfTheWeekCard';
import { Plant } from '@/types/plant';
import { getPlantById } from '@/lib/plants';
import { addToShoppingList } from '@/lib/shopping-list';
import { getCompanionPlants } from '@/lib/recommendations';
import { getPlantOfTheWeek } from '@/lib/plantOfTheWeek';
import { isIdealForZone } from '@/lib/zoneRanking';

export default function PlantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const zone = searchParams?.get('zone');
  const zoneNum = zone ? parseInt(zone) : 5; // Default to zone 5

  const [plant, setPlant] = useState<Plant | null>(null);
  const [companionPlants, setCompanionPlants] = useState<Plant[]>([]);
  const [plantOfWeek, setPlantOfWeek] = useState<Plant | null>(null);
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

          // Load companion plants
          const companions = getCompanionPlants(plantData, zoneNum, 6);
          setCompanionPlants(companions);

          // Load plant of the week
          const potw = getPlantOfTheWeek(zoneNum);
          if (potw && potw.id !== id) {
            setPlantOfWeek(potw);
          }
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
  }, [id, zoneNum]);

  const handleAddToShoppingList = () => {
    if (!plant) return;

    addToShoppingList(plant.id, plant.commonName);
    setAddedToList(true);

    window.dispatchEvent(new Event('shoppingListUpdated'));
    setTimeout(() => setAddedToList(false), 3000);
  };

  const getSoilPhDescription = (soilPhRange?: { min: number; max: number }) => {
    if (!soilPhRange) return null;
    const { min, max } = soilPhRange;
    let description = `${min}–${max}`;

    if (max < 6.5) description += ' (acidic)';
    else if (min > 7.5) description += ' (alkaline)';
    else if (min >= 6.5 && max <= 7.5) description += ' (neutral)';
    else description += ' (slightly acidic to neutral)';

    return description;
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

            {/* Hero Banner */}
            <Paper
              sx={{
                position: 'relative',
                height: 400,
                borderRadius: 3,
                overflow: 'hidden',
                mb: 3
              }}
            >
              <Image
                src={plant.imageUrl || 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f'}
                alt={plant.commonName}
                fill
                style={{ objectFit: 'cover' }}
                sizes="100vw"
                priority
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  p: 3
                }}
              >
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{ color: 'white', fontWeight: 700, mb: 1, fontFamily: 'Lora' }}
                >
                  {plant.commonName}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}
                >
                  {plant.scientificName}
                </Typography>
              </Box>
            </Paper>

            {/* Badges */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {plant.isNative && (
                <Chip
                  label="Native"
                  color="success"
                  icon={<LocalFloristIcon />}
                  sx={{ fontWeight: 600 }}
                />
              )}
              {plant.isPollinatorFriendly && (
                <Chip
                  label="Pollinator-Friendly"
                  color="info"
                  icon={<BugReportIcon />}
                  sx={{ fontWeight: 600 }}
                />
              )}
              {plant.toxicityToPets === 'toxic' && (
                <Chip
                  label="Toxic to Pets"
                  color="error"
                  icon={<WarningIcon />}
                  sx={{ fontWeight: 600 }}
                />
              )}
              {plant.toxicityToPets === 'non-toxic' && (
                <Chip
                  label="Pet Safe"
                  color="success"
                  sx={{ fontWeight: 600 }}
                />
              )}
              {plant.beginnerFriendly && (
                <Chip
                  label="Beginner-Friendly"
                  color="primary"
                  icon={<StarIcon />}
                  sx={{ fontWeight: 600 }}
                />
              )}
              <ZoneBadge plant={plant} zone={zoneNum} variant="large" />
            </Box>

            {/* Two-column layout */}
            <Grid container spacing={3}>
              {/* Left Column */}
              <Grid item xs={12} md={8}>
                {/* Description */}
                {plant.description && (
                  <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                      {plant.description}
                    </Typography>
                  </Paper>
                )}

                {/* Toxicity Alert */}
                {plant.toxicityToPets === 'toxic' && (
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    This plant is toxic to pets if ingested. Keep away from cats, dogs, and other animals.
                    {plant.aspcaUrl && (
                      <>
                        {' '}
                        <MuiLink
                          href={plant.aspcaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="inherit"
                          underline="always"
                        >
                          Learn more from ASPCA
                        </MuiLink>
                      </>
                    )}
                  </Alert>
                )}

                {/* Key Growing Conditions */}
                <Card sx={{ mb: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom fontWeight={600}>
                      Key Growing Conditions
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                      {plant.sunExposure && plant.sunExposure.length > 0 && (
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <WbSunnyIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="subtitle2" color="text.secondary">
                              Sun
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {plant.sunExposure
                                .map(s => s.replace('-', ' '))
                                .map(s => s.charAt(0).toUpperCase() + s.slice(1))
                                .join(', ')}
                            </Typography>
                          </Box>
                        </Grid>
                      )}

                      {plant.waterNeeds && (
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <WaterDropIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="subtitle2" color="text.secondary">
                              Water
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {plant.waterNeeds.charAt(0).toUpperCase() + plant.waterNeeds.slice(1)}
                            </Typography>
                          </Box>
                        </Grid>
                      )}

                      {plant.soilPhRange && (
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" sx={{ mb: 1 }}>🌱</Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                              Soil pH
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {getSoilPhDescription(plant.soilPhRange)}
                            </Typography>
                          </Box>
                        </Grid>
                      )}

                      {plant.spacingInches && (
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" sx={{ mb: 1 }}>📏</Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                              Spacing
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {plant.spacingInches}"
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>

                {/* Additional Details */}
                <Card sx={{ mb: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom fontWeight={600}>
                      Plant Details
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <List>
                      {plant.bloomPeriod && (
                        <ListItem>
                          <ListItemIcon>🌸</ListItemIcon>
                          <ListItemText
                            primary="Bloom Period"
                            secondary={plant.bloomPeriod}
                          />
                        </ListItem>
                      )}

                      {plant.pollinators && plant.pollinators.length > 0 && (
                        <ListItem>
                          <ListItemIcon>🦋</ListItemIcon>
                          <ListItemText
                            primary="Pollinators Attracted"
                            secondary={plant.pollinators.join(', ')}
                          />
                        </ListItem>
                      )}

                      {plant.suggestedUse && (
                        <ListItem>
                          <ListItemIcon>💡</ListItemIcon>
                          <ListItemText
                            primary="Suggested Uses"
                            secondary={plant.suggestedUse}
                          />
                        </ListItem>
                      )}

                      {plant.plantingDepthInches && (
                        <ListItem>
                          <ListItemIcon>⚒️</ListItemIcon>
                          <ListItemText
                            primary="Planting Depth"
                            secondary={`${plant.plantingDepthInches} inches`}
                          />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                </Card>

                {/* Notes */}
                {plant.notes && (
                  <Card sx={{ mb: 3, borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom fontWeight={600}>
                        Planting Notes
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body1">{plant.notes}</Typography>
                    </CardContent>
                  </Card>
                )}
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={4}>
                {/* Add to Shopping List */}
                <Card sx={{ mb: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={<AddShoppingCartIcon />}
                      onClick={handleAddToShoppingList}
                    >
                      Add to Shopping List
                    </Button>
                  </CardContent>
                </Card>

                {/* Zone Info */}
                {plant.zoneMin && plant.zoneMax && (
                  <Card sx={{ mb: 3, borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        Hardiness Zones
                      </Typography>
                      <Typography variant="h4" color="primary" gutterBottom>
                        {plant.zoneMin}–{plant.zoneMax}
                      </Typography>
                      {isIdealForZone(plant, zoneNum) && (
                        <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mt: 1 }}>
                          Perfect for Zone {zoneNum}!
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Care Checklist */}
                {plant.beginnerFriendly && (
                  <Card sx={{ mb: 3, borderRadius: 2, bgcolor: 'success.light' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom fontWeight={600} sx={{ color: 'success.contrastText' }}>
                        Beginner-Friendly Care
                      </Typography>
                      <List dense sx={{ color: 'success.contrastText' }}>
                        <ListItem>
                          <ListItemIcon sx={{ color: 'inherit' }}>
                            <CheckCircleIcon />
                          </ListItemIcon>
                          <ListItemText primary="Easy to grow" />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon sx={{ color: 'inherit' }}>
                            <CheckCircleIcon />
                          </ListItemIcon>
                          <ListItemText primary="Forgiving of mistakes" />
                        </ListItem>
                        {plant.waterNeeds === 'low' && (
                          <ListItem>
                            <ListItemIcon sx={{ color: 'inherit' }}>
                              <CheckCircleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Drought tolerant" />
                          </ListItem>
                        )}
                      </List>
                    </CardContent>
                  </Card>
                )}

                {/* Companion Plants */}
                {companionPlants.length > 0 && (
                  <Card sx={{ mb: 3, borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        Companion Plants
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Plants that grow well with {plant.commonName}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {companionPlants.slice(0, 4).map(companion => (
                          <Box
                            key={companion.id}
                            sx={{
                              p: 1,
                              border: 1,
                              borderColor: 'divider',
                              borderRadius: 1,
                              cursor: 'pointer',
                              '&:hover': {
                                bgcolor: 'action.hover'
                              }
                            }}
                            onClick={() => router.push(`/plants/${companion.id}?zone=${zoneNum}`)}
                          >
                            <Typography variant="body2" fontWeight={600}>
                              {companion.commonName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              {companion.scientificName}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </Grid>
            </Grid>

            {/* Plant of the Week */}
            {plantOfWeek && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Plant of the Week
                </Typography>
                <PlantOfTheWeekCard plant={plantOfWeek} zone={zoneNum} />
              </Box>
            )}
          </>
        ) : null}
      </Container>
    </ClientLayout>
  );
}
