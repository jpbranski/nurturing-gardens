import { Plant, PlantFilters, PlantOverride } from '@/types/plant';

// Mock plant data for development
// In production, this would connect to a real plant API
const mockPlants: Plant[] = [
  {
    id: 'echinacea-purpurea',
    commonName: 'Purple Coneflower',
    scientificName: 'Echinacea purpurea',
    imageUrl: 'https://images.unsplash.com/photo-1597165171577-346229e51a45',
    zoneMin: 3,
    zoneMax: 9,
    isNative: true,
    isPollinatorFriendly: true,
    sunExposure: ['full-sun', 'part-sun'],
    soilPhRange: { min: 6.0, max: 7.5 },
    waterNeeds: 'low',
    plantType: 'perennial',
    bloomPeriod: 'Summer to early fall',
    spacingInches: 18,
    plantingDepthInches: 0.25,
    toxicityToPets: 'non-toxic',
    beginnerFriendly: true,
    curatedForZones: [3, 4, 5, 6, 7],
    description: 'A beautiful native wildflower with purple petals and distinctive cone-shaped centers. Highly attractive to butterflies, bees, and goldfinches.',
    pollinators: ['Butterflies', 'Bees', 'Goldfinches'],
    suggestedUse: 'Prairie gardens, borders, pollinator gardens',
    notes: 'Drought tolerant once established. Deadhead to encourage more blooms or leave seed heads for winter bird food.',
  },
  {
    id: 'asclepias-tuberosa',
    commonName: 'Butterfly Weed',
    scientificName: 'Asclepias tuberosa',
    imageUrl: 'https://images.unsplash.com/photo-1563207153-f403bf289096',
    zoneMin: 3,
    zoneMax: 9,
    isNative: true,
    isPollinatorFriendly: true,
    sunExposure: ['full-sun'],
    soilPhRange: { min: 6.0, max: 7.0 },
    waterNeeds: 'low',
    plantType: 'perennial',
    bloomPeriod: 'Mid to late summer',
    spacingInches: 12,
    plantingDepthInches: 0.125,
    toxicityToPets: 'toxic',
    aspcaUrl: 'https://www.aspca.org/pet-care/animal-poison-control',
    beginnerFriendly: true,
    curatedForZones: [3, 4, 5, 6],
    description: 'Vibrant orange flowers are essential for monarch butterflies. This milkweed species is the host plant for monarch caterpillars.',
    pollinators: ['Monarch Butterflies', 'Bees', 'Other Butterflies'],
    suggestedUse: 'Pollinator gardens, meadows, dry slopes',
    notes: 'Essential for monarch butterfly conservation. Toxic if ingested - keep away from pets. Slow to emerge in spring.',
  },
  {
    id: 'rudbeckia-hirta',
    commonName: 'Black-Eyed Susan',
    scientificName: 'Rudbeckia hirta',
    imageUrl: 'https://images.unsplash.com/photo-1595429973945-f0d3c80fc571',
    zoneMin: 3,
    zoneMax: 7,
    isNative: true,
    isPollinatorFriendly: true,
    sunExposure: ['full-sun', 'part-sun'],
    soilPhRange: { min: 6.8, max: 7.7 },
    waterNeeds: 'medium',
    plantType: 'perennial',
    bloomPeriod: 'Summer to fall',
    spacingInches: 12,
    plantingDepthInches: 0.125,
    toxicityToPets: 'non-toxic',
    beginnerFriendly: true,
    curatedForZones: [3, 4, 5, 6, 7],
    description: 'Bright yellow petals with dark centers create a cheerful display. Self-seeds readily and attracts many pollinators.',
    pollinators: ['Bees', 'Butterflies', 'Birds (seeds)'],
    suggestedUse: 'Borders, meadows, naturalized areas',
    notes: 'Tolerates poor soil and drought. May self-seed prolifically. Excellent cut flower.',
  },
  {
    id: 'lavandula-angustifolia',
    commonName: 'English Lavender',
    scientificName: 'Lavandula angustifolia',
    imageUrl: 'https://images.unsplash.com/photo-1611251184453-dcd6e1bb36a4',
    zoneMin: 5,
    zoneMax: 9,
    isNative: false,
    isPollinatorFriendly: true,
    sunExposure: ['full-sun'],
    soilPhRange: { min: 6.5, max: 7.5 },
    waterNeeds: 'low',
    plantType: 'perennial',
    bloomPeriod: 'Late spring to summer',
    spacingInches: 24,
    plantingDepthInches: 0.25,
    toxicityToPets: 'toxic',
    aspcaUrl: 'https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/lavender',
    beginnerFriendly: true,
    curatedForZones: [5, 6, 7, 8],
    description: 'Fragrant purple flowers beloved by bees and butterflies. Aromatic foliage is drought tolerant.',
    pollinators: ['Bees', 'Butterflies'],
    suggestedUse: 'Herb gardens, borders, containers',
    notes: 'Requires well-drained soil. Prune after flowering. Mildly toxic to pets if ingested in large quantities.',
  },
  {
    id: 'aquilegia-canadensis',
    commonName: 'Wild Columbine',
    scientificName: 'Aquilegia canadensis',
    imageUrl: 'https://images.unsplash.com/photo-1524587920944-78e345e34e2a',
    zoneMin: 3,
    zoneMax: 8,
    isNative: true,
    isPollinatorFriendly: true,
    sunExposure: ['part-sun', 'shade'],
    soilPhRange: { min: 6.0, max: 7.0 },
    waterNeeds: 'medium',
    plantType: 'perennial',
    bloomPeriod: 'Late spring to early summer',
    spacingInches: 12,
    plantingDepthInches: 0.125,
    toxicityToPets: 'toxic',
    aspcaUrl: 'https://www.aspca.org/pet-care/animal-poison-control',
    beginnerFriendly: true,
    curatedForZones: [3, 4, 5],
    description: 'Delicate red and yellow flowers are perfectly designed for hummingbirds. Native woodland wildflower.',
    pollinators: ['Hummingbirds', 'Bees', 'Butterflies'],
    suggestedUse: 'Woodland gardens, shade gardens, rock gardens',
    notes: 'Self-seeds readily. Prefers partial shade. All parts toxic if ingested.',
  },
  {
    id: 'salvia-nemorosa',
    commonName: 'Woodland Sage',
    scientificName: 'Salvia nemorosa',
    imageUrl: 'https://images.unsplash.com/photo-1533628635777-037afca3b375',
    zoneMin: 4,
    zoneMax: 8,
    isNative: false,
    isPollinatorFriendly: true,
    sunExposure: ['full-sun', 'part-sun'],
    soilPhRange: { min: 6.5, max: 7.5 },
    waterNeeds: 'medium',
    plantType: 'perennial',
    bloomPeriod: 'Late spring to fall',
    spacingInches: 18,
    plantingDepthInches: 0.25,
    toxicityToPets: 'non-toxic',
    beginnerFriendly: true,
    curatedForZones: [4, 5, 6, 7],
    description: 'Spikes of purple-blue flowers bloom for months. Excellent for attracting bees and butterflies.',
    pollinators: ['Bees', 'Butterflies', 'Hummingbirds'],
    suggestedUse: 'Borders, cottage gardens, pollinator gardens',
    notes: 'Deadhead to encourage continuous blooming. Drought tolerant once established.',
  },
];

let plantOverrides: PlantOverride[] = [];

// Load plant overrides from JSON file
// This would be imported from data/plant-overrides.json in a real implementation
export function loadPlantOverrides(overrides: PlantOverride[]) {
  plantOverrides = overrides;
}

// Apply overrides to a plant
function applyOverrides(plant: Plant): Plant {
  const override = plantOverrides.find(o => o.id === plant.id);
  if (!override) return plant;

  return {
    ...plant,
    ...override,
    // Merge certain fields instead of replacing
    notes: override.notes || plant.notes,
  };
}

// Generic API client for external plant APIs
// Configuration via environment variables
async function fetchFromPlantAPI(endpoint: string): Promise<any> {
  const baseUrl = process.env.PLANT_API_BASE_URL;
  const apiKey = process.env.PLANT_API_KEY;

  if (!baseUrl || !apiKey) {
    console.warn('Plant API not configured, using mock data');
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Plant API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch from plant API:', error);
    return null;
  }
}

// Map external API response to our Plant interface
// This is a generic mapper - adjust based on actual API response structure
function mapAPIResponseToPlant(apiData: any): Plant {
  // This is a placeholder mapping - adjust based on actual API structure
  return {
    id: apiData.id || apiData.slug,
    commonName: apiData.common_name || apiData.name,
    scientificName: apiData.scientific_name || apiData.latin_name,
    imageUrl: apiData.image_url || apiData.default_image?.medium_url,
    zoneMin: apiData.hardiness?.min || apiData.zone_min,
    zoneMax: apiData.hardiness?.max || apiData.zone_max,
    sunExposure: apiData.sun_exposure || apiData.light,
    soilPhRange: apiData.soil_ph,
    waterNeeds: apiData.water_needs || apiData.watering,
    plantType: apiData.type || apiData.category,
    bloomPeriod: apiData.bloom_period || apiData.flowering_season,
    description: apiData.description,
  };
}

/**
 * Get plants suitable for a specific USDA hardiness zone
 */
export async function getPlantsForZone(zone: number): Promise<Plant[]> {
  // Try to fetch from external API first
  const apiData = await fetchFromPlantAPI(`/plants?zone=${zone}`);

  let plants: Plant[];

  if (apiData) {
    // Map API response to our Plant interface
    plants = Array.isArray(apiData)
      ? apiData.map(mapAPIResponseToPlant)
      : apiData.data?.map(mapAPIResponseToPlant) || [];
  } else {
    // Fall back to mock data
    plants = mockPlants.filter(plant => {
      if (!plant.zoneMin || !plant.zoneMax) return true;
      return zone >= plant.zoneMin && zone <= plant.zoneMax;
    });
  }

  // Apply local overrides
  return plants.map(applyOverrides);
}

/**
 * Get a single plant by ID
 */
export async function getPlantById(id: string): Promise<Plant | null> {
  // Try to fetch from external API first
  const apiData = await fetchFromPlantAPI(`/plants/${id}`);

  let plant: Plant | null;

  if (apiData) {
    plant = mapAPIResponseToPlant(apiData);
  } else {
    // Fall back to mock data
    plant = mockPlants.find(p => p.id === id) || null;
  }

  if (!plant) return null;

  // Apply local overrides
  return applyOverrides(plant);
}

/**
 * Get all plants (optionally filtered)
 */
export async function getAllPlants(filters?: PlantFilters): Promise<Plant[]> {
  // Try to fetch from external API first
  const apiData = await fetchFromPlantAPI('/plants');

  let plants: Plant[];

  if (apiData) {
    plants = Array.isArray(apiData)
      ? apiData.map(mapAPIResponseToPlant)
      : apiData.data?.map(mapAPIResponseToPlant) || [];
  } else {
    // Fall back to mock data
    plants = [...mockPlants];
  }

  // Apply local overrides
  plants = plants.map(applyOverrides);

  // Apply filters
  if (filters) {
    plants = filterPlants(plants, filters);
  }

  return plants;
}

/**
 * Filter plants based on criteria
 */
export function filterPlants(plants: Plant[], filters: PlantFilters): Plant[] {
  return plants.filter(plant => {
    // Zone filter
    if (filters.zone !== undefined) {
      if (!plant.zoneMin || !plant.zoneMax) return true;
      if (filters.zone < plant.zoneMin || filters.zone > plant.zoneMax) return false;
    }

    // Native filter
    if (filters.nativeOnly && !plant.isNative) return false;

    // Pollinator filter
    if (filters.pollinatorFriendlyOnly && !plant.isPollinatorFriendly) return false;

    // Toxic to pets filter
    if (filters.excludeToxicToPets && plant.toxicityToPets === 'toxic') return false;

    // Sun exposure filter
    if (filters.sunExposure && filters.sunExposure.length > 0) {
      if (!plant.sunExposure || !plant.sunExposure.some(se => filters.sunExposure!.includes(se))) {
        return false;
      }
    }

    // Plant type filter
    if (filters.plantType && filters.plantType.length > 0) {
      if (!plant.plantType || !filters.plantType.includes(plant.plantType)) {
        return false;
      }
    }

    // Water needs filter
    if (filters.waterNeeds && plant.waterNeeds !== filters.waterNeeds) {
      return false;
    }

    // Beginner friendly filter
    if (filters.beginnerFriendlyOnly && !plant.beginnerFriendly) return false;

    return true;
  });
}

/**
 * Get curated starter plants for a specific zone
 */
export async function getCuratedPlantsForZone(zone: number): Promise<Plant[]> {
  const allPlants = await getAllPlants({ zone });
  return allPlants.filter(plant =>
    plant.curatedForZones && plant.curatedForZones.includes(zone)
  );
}
