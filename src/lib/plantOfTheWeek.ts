/**
 * PLANT OF THE WEEK UTILITY
 *
 * Selects a zone-appropriate featured plant for each week
 * The selection is seeded by week number to ensure stability
 */

import { Plant } from '@/types/plant';
import { getPlants } from '@/lib/localPlantData';
import { isIdealForZone } from '@/lib/zoneRanking';

/**
 * Get the current ISO week number
 * @returns Week number (1-53)
 */
function getWeekNumber(date: Date = new Date()): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Get the current season based on month
 * @returns Season name
 */
function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter';
}

/**
 * Seeded random number generator
 * @param seed - Seed value
 * @returns Random number between 0 and 1
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Get plant of the week for a given zone
 * Selection is stable for the entire week
 *
 * @param zone - User's USDA hardiness zone
 * @returns Selected plant of the week
 */
export function getPlantOfTheWeek(zone: number): Plant | null {
  const allPlants = getPlants();

  // Filter for zone-appropriate plants
  const zonePlants = allPlants.filter(plant => isIdealForZone(plant, zone));

  if (zonePlants.length === 0) {
    // Fallback to all plants if no zone match
    return allPlants.length > 0 ? allPlants[0] : null;
  }

  // Score plants based on preferences
  const scoredPlants = zonePlants.map(plant => {
    let score = 0;

    // Prefer pollinator-friendly plants
    if (plant.isPollinatorFriendly) score += 3;

    // Prefer beginner-friendly plants
    if (plant.beginnerFriendly) score += 2;

    // Prefer native plants
    if (plant.isNative) score += 2;

    // Prefer non-toxic plants
    if (plant.toxicityToPets === 'non-toxic') score += 1;

    // Prefer plants with images
    if (plant.imageUrl) score += 1;

    return { plant, score };
  });

  // Sort by score
  scoredPlants.sort((a, b) => b.score - a.score);

  // Get top candidates (top 50% of scored plants)
  const topCandidates = scoredPlants.slice(0, Math.max(1, Math.floor(scoredPlants.length * 0.5)));

  // Use week number as seed for stable weekly selection
  const weekNumber = getWeekNumber();
  const year = new Date().getFullYear();
  const seed = year * 100 + weekNumber;

  // Select from top candidates using seeded random
  const index = Math.floor(seededRandom(seed) * topCandidates.length);

  return topCandidates[index].plant;
}

/**
 * Get reason why a plant was selected as plant of the week
 *
 * @param plant - The selected plant
 * @returns Array of reason strings
 */
export function getSelectionReasons(plant: Plant): string[] {
  const reasons: string[] = [];

  if (plant.isPollinatorFriendly) {
    reasons.push('Attracts beneficial pollinators');
  }

  if (plant.isNative) {
    reasons.push('Native to your region');
  }

  if (plant.beginnerFriendly) {
    reasons.push('Perfect for beginners');
  }

  if (plant.toxicityToPets === 'non-toxic') {
    reasons.push('Safe for pets');
  }

  if (plant.waterNeeds === 'low') {
    reasons.push('Drought tolerant');
  }

  return reasons;
}
