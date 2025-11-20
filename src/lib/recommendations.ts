/**
 * PLANT RECOMMENDATIONS UTILITY
 *
 * Generates curated plant bundles and collections based on themes
 * and user preferences.
 */

import { Plant, WaterNeeds } from '@/types/plant';
import { getPlants } from '@/lib/localPlantData';
import { isIdealForZone, zoneScore } from '@/lib/zoneRanking';

export interface PlantBundle {
  id: string;
  name: string;
  description: string;
  plants: Plant[];
  criteria: string[];
}

/**
 * Get beginner starter pack
 * Criteria:
 * - Beginner friendly
 * - Non-toxic or unknown toxicity
 * - Zone appropriate
 * - Low to medium water needs
 * - At least one pollinator-friendly plant
 */
export function getBeginnerStarterPack(zone: number): PlantBundle {
  const allPlants = getPlants();

  // Filter candidates
  const candidates = allPlants.filter(plant => {
    if (!plant.beginnerFriendly) return false;
    if (plant.toxicityToPets === 'toxic') return false;
    if (!isIdealForZone(plant, zone)) return false;
    if (plant.waterNeeds === 'high') return false;
    return true;
  });

  // Score and sort
  const scored = candidates.map(plant => {
    let score = zoneScore(plant, zone);

    // Bonus for pollinator friendly
    if (plant.isPollinatorFriendly) score += 30;

    // Bonus for native
    if (plant.isNative) score += 20;

    // Bonus for non-toxic
    if (plant.toxicityToPets === 'non-toxic') score += 15;

    // Bonus for low water needs
    if (plant.waterNeeds === 'low') score += 10;

    return { plant, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Select top 8-12 plants
  const count = Math.min(12, Math.max(8, scored.length));
  const plants = scored.slice(0, count).map(s => s.plant);

  return {
    id: 'beginner-starter',
    name: 'Beginner Starter Pack',
    description: 'Easy-to-grow, forgiving plants perfect for first-time gardeners. These low-maintenance beauties will build your confidence!',
    plants,
    criteria: [
      'Beginner-friendly',
      'Pet-safe or unknown toxicity',
      'Zone-appropriate',
      'Low to medium water needs',
      'Includes pollinator-friendly options'
    ]
  };
}

/**
 * Get pollinator garden pack
 * Criteria:
 * - Pollinator friendly
 * - Bloom periods spanning spring to fall
 * - Mix of heights and plant types
 * - Zone appropriate
 */
export function getPollinatorGardenPack(zone: number): PlantBundle {
  const allPlants = getPlants();

  // Filter candidates
  const candidates = allPlants.filter(plant => {
    if (!plant.isPollinatorFriendly) return false;
    if (!isIdealForZone(plant, zone)) return false;
    return true;
  });

  // Score and sort
  const scored = candidates.map(plant => {
    let score = zoneScore(plant, zone);

    // Bonus for native (great for local pollinators)
    if (plant.isNative) score += 40;

    // Bonus for perennials (long-term value)
    if (plant.plantType === 'perennial') score += 20;

    // Bonus for beginner friendly
    if (plant.beginnerFriendly) score += 15;

    // Bonus for variety in plant types
    if (plant.plantType === 'shrub') score += 10;
    if (plant.plantType === 'tree') score += 10;

    return { plant, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Select top 8-12 plants
  const count = Math.min(12, Math.max(8, scored.length));
  const plants = scored.slice(0, count).map(s => s.plant);

  return {
    id: 'pollinator-garden',
    name: 'Pollinator Garden Pack',
    description: 'Create a buzzing paradise for bees, butterflies, and hummingbirds with this carefully selected collection of nectar-rich plants.',
    plants,
    criteria: [
      'All pollinator-friendly',
      'Extended bloom season',
      'Mix of plant types and heights',
      'Zone-appropriate',
      'Native plants prioritized'
    ]
  };
}

/**
 * Get native garden pack
 * Criteria:
 * - Native plants
 * - Pollinator friendly weighted highly
 * - Drought resistant weighted
 * - Zone appropriate
 */
export function getNativeGardenPack(zone: number): PlantBundle {
  const allPlants = getPlants();

  // Filter candidates
  const candidates = allPlants.filter(plant => {
    if (!plant.isNative) return false;
    if (!isIdealForZone(plant, zone)) return false;
    return true;
  });

  // Score and sort
  const scored = candidates.map(plant => {
    let score = zoneScore(plant, zone);

    // Bonus for pollinator friendly
    if (plant.isPollinatorFriendly) score += 50;

    // Bonus for drought tolerance
    if (plant.waterNeeds === 'low') score += 30;

    // Bonus for beginner friendly
    if (plant.beginnerFriendly) score += 20;

    // Bonus for perennials
    if (plant.plantType === 'perennial') score += 15;

    return { plant, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Select top 8-12 plants
  const count = Math.min(12, Math.max(8, scored.length));
  const plants = scored.slice(0, count).map(s => s.plant);

  return {
    id: 'native-garden',
    name: 'Native Garden Pack',
    description: 'Embrace your local ecosystem with these native plants that support wildlife, require less water, and thrive in your climate.',
    plants,
    criteria: [
      'All native plants',
      'Pollinator-friendly prioritized',
      'Drought-tolerant options',
      'Zone-appropriate',
      'Low-maintenance selections'
    ]
  };
}

/**
 * Get shade garden pack
 * Criteria:
 * - Sun exposure includes shade
 * - Low to medium water needs
 * - Shade-tolerant varieties
 * - Zone appropriate
 */
export function getShadeGardenPack(zone: number): PlantBundle {
  const allPlants = getPlants();

  // Filter candidates
  const candidates = allPlants.filter(plant => {
    if (!plant.sunExposure?.includes('shade')) return false;
    if (!isIdealForZone(plant, zone)) return false;
    return true;
  });

  // Score and sort
  const scored = candidates.map(plant => {
    let score = zoneScore(plant, zone);

    // Bonus for native
    if (plant.isNative) score += 30;

    // Bonus for beginner friendly
    if (plant.beginnerFriendly) score += 25;

    // Bonus for non-toxic
    if (plant.toxicityToPets === 'non-toxic') score += 20;

    // Bonus for low water
    if (plant.waterNeeds === 'low') score += 15;

    // Bonus for perennials
    if (plant.plantType === 'perennial') score += 10;

    return { plant, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Select top 8-12 plants
  const count = Math.min(12, Math.max(8, scored.length));
  const plants = scored.slice(0, count).map(s => s.plant);

  return {
    id: 'shade-garden',
    name: 'Shade Garden Pack',
    description: 'Transform shady spots into lush gardens with these shade-loving plants that bring color and life to darker areas.',
    plants,
    criteria: [
      'Shade-tolerant',
      'Low to medium water needs',
      'Zone-appropriate',
      'Native options prioritized',
      'Mix of textures and colors'
    ]
  };
}

/**
 * Get low water garden pack (drought-resistant)
 */
export function getLowWaterGardenPack(zone: number): PlantBundle {
  const allPlants = getPlants();

  const candidates = allPlants.filter(plant => {
    if (plant.waterNeeds !== 'low') return false;
    if (!isIdealForZone(plant, zone)) return false;
    return true;
  });

  const scored = candidates.map(plant => {
    let score = zoneScore(plant, zone);

    if (plant.isNative) score += 40;
    if (plant.isPollinatorFriendly) score += 30;
    if (plant.beginnerFriendly) score += 20;
    if (plant.plantType === 'perennial') score += 15;

    return { plant, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const count = Math.min(12, Math.max(8, scored.length));
  const plants = scored.slice(0, count).map(s => s.plant);

  return {
    id: 'low-water-garden',
    name: 'Drought-Resistant Garden Pack',
    description: 'Perfect for water conservation! These tough plants thrive with minimal irrigation once established.',
    plants,
    criteria: [
      'Low water needs',
      'Drought-tolerant once established',
      'Zone-appropriate',
      'Native and pollinator-friendly options',
      'Low-maintenance'
    ]
  };
}

/**
 * Get full sun garden pack
 */
export function getFullSunGardenPack(zone: number): PlantBundle {
  const allPlants = getPlants();

  const candidates = allPlants.filter(plant => {
    if (!plant.sunExposure?.includes('full-sun')) return false;
    if (!isIdealForZone(plant, zone)) return false;
    return true;
  });

  const scored = candidates.map(plant => {
    let score = zoneScore(plant, zone);

    if (plant.isPollinatorFriendly) score += 35;
    if (plant.isNative) score += 30;
    if (plant.beginnerFriendly) score += 20;
    if (plant.waterNeeds === 'low') score += 15;

    return { plant, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const count = Math.min(12, Math.max(8, scored.length));
  const plants = scored.slice(0, count).map(s => s.plant);

  return {
    id: 'full-sun-garden',
    name: 'Full Sun Garden Pack',
    description: 'Brighten up sunny spots with these sun-loving plants that thrive in direct sunlight.',
    plants,
    criteria: [
      'Full sun tolerance',
      'Zone-appropriate',
      'Pollinator-friendly prioritized',
      'Mix of heights and colors',
      'Drought-tolerant options included'
    ]
  };
}

/**
 * Get all available bundles for a zone
 */
export function getAllBundles(zone: number): PlantBundle[] {
  return [
    getBeginnerStarterPack(zone),
    getPollinatorGardenPack(zone),
    getNativeGardenPack(zone),
    getShadeGardenPack(zone),
    getLowWaterGardenPack(zone),
    getFullSunGardenPack(zone)
  ].filter(bundle => bundle.plants.length >= 3); // Only return bundles with at least 3 plants
}

/**
 * Get companion plants for a given plant
 * Based on similar growing conditions and complementary characteristics
 */
export function getCompanionPlants(plant: Plant, zone: number, limit: number = 6): Plant[] {
  const allPlants = getPlants().filter(p => p.id !== plant.id);

  const scored = allPlants.map(candidate => {
    let score = 0;

    // Zone compatibility
    score += zoneScore(candidate, zone);

    // Similar sun exposure
    if (plant.sunExposure && candidate.sunExposure) {
      const overlap = plant.sunExposure.filter(se => candidate.sunExposure?.includes(se));
      score += overlap.length * 25;
    }

    // Similar water needs
    if (plant.waterNeeds === candidate.waterNeeds) score += 30;

    // Both native
    if (plant.isNative && candidate.isNative) score += 40;

    // Both pollinator friendly
    if (plant.isPollinatorFriendly && candidate.isPollinatorFriendly) score += 35;

    // Complementary plant types (variety is good)
    if (plant.plantType !== candidate.plantType) score += 15;

    return { plant: candidate, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(s => s.plant);
}
