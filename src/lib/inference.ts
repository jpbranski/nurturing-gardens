/**
 * PLANT INFERENCE MODULE
 *
 * This module provides inference functions for deriving plant characteristics
 * based on available data.
 */

interface Plant {
  id?: string;
  scientificName?: string;
  commonName?: string;
  isNative?: boolean;
  droughtTolerance?: string;
  waterNeeds?: string;
  zoneMin?: number;
  zoneMax?: number;
  sunExposure?: string[];
  plantType?: string;
  beginnerFriendly?: boolean;
  [key: string]: any;
}

/**
 * Infer if a plant is beginner-friendly based on its characteristics
 *
 * A plant is considered beginner-friendly if it has one or more of:
 * - Native to the region (easier adaptation)
 * - Medium or low water needs (drought tolerant)
 * - Grows in zones 5-7 (temperate, common zones)
 * - Low maintenance requirements
 *
 * @param plant - The plant object to evaluate
 * @returns true if the plant is beginner-friendly, false otherwise
 */
export function inferBeginnerFriendly(plant: Plant): boolean {
  // If already explicitly set, trust that value
  if (plant.beginnerFriendly !== undefined) {
    return plant.beginnerFriendly;
  }

  let score = 0;

  // Native plants are generally easier to grow in their region
  if (plant.isNative === true) {
    score += 2;
  }

  // Drought-tolerant or low-water plants are easier for beginners
  if (plant.droughtTolerance === 'medium' || plant.droughtTolerance === 'high') {
    score += 1;
  }
  if (plant.waterNeeds === 'low' || plant.waterNeeds === 'medium') {
    score += 1;
  }

  // Plants that grow in common temperate zones (5-7) are widely adaptable
  if (plant.zoneMin !== undefined && plant.zoneMax !== undefined) {
    if (plant.zoneMin <= 5 && plant.zoneMax >= 7) {
      score += 1;
    }
  }

  // Perennials are often easier than annuals (less replanting)
  if (plant.plantType === 'perennial') {
    score += 1;
  }

  // Full sun plants tend to be more forgiving
  if (plant.sunExposure?.includes('full-sun')) {
    score += 1;
  }

  // Score >= 3 is considered beginner-friendly
  return score >= 3;
}

/**
 * Infer pollinator-friendly status if not explicitly set
 *
 * @param plant - The plant object to evaluate
 * @returns true if the plant is likely pollinator-friendly
 */
export function inferPollinatorFriendly(plant: Plant): boolean {
  if (plant.isPollinatorFriendly !== undefined) {
    return plant.isPollinatorFriendly;
  }

  // Check if pollinators array exists and has values
  if (plant.pollinators && Array.isArray(plant.pollinators) && plant.pollinators.length > 0) {
    return true;
  }

  // Native flowering plants are often pollinator-friendly
  if (plant.isNative && plant.bloomPeriod) {
    return true;
  }

  return false;
}

/**
 * Infer water needs from drought tolerance
 *
 * @param droughtTolerance - USDA drought tolerance rating
 * @returns Normalized water needs
 */
export function inferWaterNeeds(droughtTolerance?: string): string | undefined {
  if (!droughtTolerance) return undefined;

  const tolerance = droughtTolerance.toLowerCase();

  if (tolerance === 'high') return 'low';
  if (tolerance === 'medium') return 'medium';
  if (tolerance === 'low' || tolerance === 'none') return 'high';

  return undefined;
}

/**
 * Infer sun exposure from shade tolerance
 *
 * @param shadeTolerance - USDA shade tolerance rating
 * @returns Array of sun exposure types
 */
export function inferSunExposure(shadeTolerance?: string): string[] | undefined {
  if (!shadeTolerance) return undefined;

  const tolerance = shadeTolerance.toLowerCase();

  if (tolerance === 'intolerant') return ['full-sun'];
  if (tolerance === 'intermediate') return ['full-sun', 'part-sun'];
  if (tolerance === 'tolerant') return ['part-sun', 'shade'];

  return undefined;
}

/**
 * Normalize zone range to ensure min <= max
 *
 * @param zoneMin - Minimum hardiness zone
 * @param zoneMax - Maximum hardiness zone
 * @returns Normalized zone range
 */
export function normalizeZoneRange(
  zoneMin?: number,
  zoneMax?: number
): { zoneMin?: number; zoneMax?: number } {
  if (zoneMin === undefined && zoneMax === undefined) {
    return {};
  }

  // If only one is defined, set both to the same value
  if (zoneMin !== undefined && zoneMax === undefined) {
    return { zoneMin, zoneMax: zoneMin };
  }

  if (zoneMax !== undefined && zoneMin === undefined) {
    return { zoneMin: zoneMax, zoneMax };
  }

  // If both defined, ensure min <= max
  if (zoneMin !== undefined && zoneMax !== undefined) {
    if (zoneMin > zoneMax) {
      return { zoneMin: zoneMax, zoneMax: zoneMin };
    }
    return { zoneMin, zoneMax };
  }

  return {};
}

/**
 * Apply all inference rules to a plant
 *
 * @param plant - The plant object to enrich
 * @returns The enriched plant object
 */
export function applyInference(plant: Plant): Plant {
  const enriched = { ...plant };

  // Infer beginner-friendly status
  enriched.beginnerFriendly = inferBeginnerFriendly(enriched);

  // Infer pollinator-friendly status
  enriched.isPollinatorFriendly = inferPollinatorFriendly(enriched);

  // Infer water needs from drought tolerance if not set
  if (!enriched.waterNeeds && enriched.droughtTolerance) {
    enriched.waterNeeds = inferWaterNeeds(enriched.droughtTolerance);
  }

  // Infer sun exposure from shade tolerance if not set
  if (
    (!enriched.sunExposure || enriched.sunExposure.length === 0) &&
    enriched.shadeTolerance
  ) {
    enriched.sunExposure = inferSunExposure(enriched.shadeTolerance);
  }

  // Normalize zone range
  const zones = normalizeZoneRange(enriched.zoneMin, enriched.zoneMax);
  enriched.zoneMin = zones.zoneMin;
  enriched.zoneMax = zones.zoneMax;

  return enriched;
}
