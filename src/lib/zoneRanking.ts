/**
 * ZONE RANKING UTILITY
 *
 * Provides zone-based ranking for plants to prioritize zone-appropriate plants
 * in search results and recommendations.
 */

import { Plant } from '@/types/plant';

/**
 * Calculate a zone score for a plant based on user's hardiness zone
 *
 * @param plant - The plant to score
 * @param zone - The user's USDA hardiness zone (1-13)
 * @returns Score (100 = perfect match, 50 = close match, 0 = poor match)
 */
export function zoneScore(plant: Plant, zone: number): number {
  // If plant has no zone data, give neutral score
  if (!plant.zoneMin || !plant.zoneMax) {
    return 50;
  }

  // Perfect match: zone is within plant's range
  if (zone >= plant.zoneMin && zone <= plant.zoneMax) {
    return 100;
  }

  // Close match: zone is 1 away from plant's range
  if (Math.abs(zone - plant.zoneMin) === 1 || Math.abs(zone - plant.zoneMax) === 1) {
    return 50;
  }

  // Poor match: outside range
  return 0;
}

/**
 * Sort plants by zone score (highest first)
 *
 * @param plants - Array of plants to sort
 * @param zone - The user's USDA hardiness zone
 * @returns Sorted array of plants
 */
export function sortByZoneScore(plants: Plant[], zone: number): Plant[] {
  return [...plants].sort((a, b) => zoneScore(b, zone) - zoneScore(a, zone));
}

/**
 * Check if a plant is ideal for a given zone
 *
 * @param plant - The plant to check
 * @param zone - The user's USDA hardiness zone
 * @returns True if plant is in the ideal range for the zone
 */
export function isIdealForZone(plant: Plant, zone: number): boolean {
  return zoneScore(plant, zone) === 100;
}

/**
 * Check if a plant is close to ideal for a given zone
 *
 * @param plant - The plant to check
 * @param zone - The user's USDA hardiness zone
 * @returns True if plant is close to ideal (within 1 zone)
 */
export function isCloseToZone(plant: Plant, zone: number): boolean {
  return zoneScore(plant, zone) >= 50;
}
