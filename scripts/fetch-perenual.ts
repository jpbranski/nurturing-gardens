/**
 * FETCH PERENUAL PLANT DATA SCRIPT
 *
 * This script fetches plant data from the Perenual API and normalizes it
 * into the project's Plant interface format.
 *
 * USAGE:
 *   ts-node scripts/fetch-perenual.ts
 *
 * REQUIREMENTS:
 *   - Set PLANT_API_BASE_URL and PLANT_API_KEY in .env file
 *   - Install dependencies: npm install
 *
 * OUTPUT:
 *   - data/perenual-raw.json (normalized plant data from Perenual API)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface PerenualPlant {
  id: number;
  common_name: string;
  scientific_name: string[];
  other_name?: string[];
  cycle?: string;
  watering?: string;
  sunlight?: string[];
  default_image?: {
    regular_url?: string;
    medium_url?: string;
    small_url?: string;
  };
}

interface PerenualDetailResponse {
  id: number;
  common_name: string;
  scientific_name: string[];
  other_name?: string[];
  type?: string;
  cycle?: string;
  watering?: string;
  sunlight?: string[];
  hardiness?: {
    min?: string;
    max?: string;
  };
  hardiness_location?: {
    full_url?: string;
    full_iframe?: string;
  };
  default_image?: {
    regular_url?: string;
    medium_url?: string;
    small_url?: string;
  };
  attracts?: string[];
  flowering_season?: string;
  growth_rate?: string;
  maintenance?: string;
  soil_ph?: {
    min?: number;
    max?: number;
  };
  poisonous_to_pets?: number; // 0 or 1
  poisonous_to_humans?: number;
}

interface NormalizedPlant {
  id: string;
  commonName: string;
  scientificName: string;
  imageUrl?: string;
  zoneMin?: number;
  zoneMax?: number;
  isNative?: boolean;
  isPollinatorFriendly?: boolean;
  sunExposure?: string[];
  plantType?: string;
  soilPhRange?: { min: number; max: number };
  waterNeeds?: string;
  bloomPeriod?: string;
  spacingInches?: number;
  plantingDepthInches?: number;
  beginnerFriendly?: boolean;
  toxicityToPets?: string;
  aspcaUrl?: string | null;
  curatedForZones?: number[];
  notes?: string;
  description?: string;
  pollinators?: string[];
  suggestedUse?: string;
}

const API_BASE_URL = process.env.PLANT_API_BASE_URL || 'https://perenual.com/api';
const API_KEY = process.env.PLANT_API_KEY;

if (!API_KEY) {
  console.error('❌ ERROR: PLANT_API_KEY environment variable is not set.');
  console.error('Please set PLANT_API_KEY in your .env file.');
  process.exit(1);
}

/**
 * Sleep function for rate limiting
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Normalize Perenual sunlight to project SunExposure format
 */
function normalizeSunExposure(sunlight?: string[]): string[] | undefined {
  if (!sunlight || sunlight.length === 0) return undefined;

  const normalized: string[] = [];

  sunlight.forEach(s => {
    const lower = s.toLowerCase();
    if (lower.includes('full') && lower.includes('sun')) {
      normalized.push('full-sun');
    } else if (lower.includes('part') || lower.includes('partial')) {
      normalized.push('part-sun');
    } else if (lower.includes('shade')) {
      normalized.push('shade');
    }
  });

  return normalized.length > 0 ? [...new Set(normalized)] : undefined;
}

/**
 * Normalize watering to project WaterNeeds format
 */
function normalizeWaterNeeds(watering?: string): string | undefined {
  if (!watering) return undefined;

  const lower = watering.toLowerCase();
  if (lower.includes('frequent') || lower.includes('average')) return 'medium';
  if (lower.includes('minimum') || lower.includes('none')) return 'low';
  if (lower.includes('high')) return 'high';

  return 'medium'; // default
}

/**
 * Normalize plant type
 */
function normalizePlantType(cycle?: string, type?: string): string | undefined {
  if (type) {
    const lower = type.toLowerCase();
    if (lower.includes('tree')) return 'tree';
    if (lower.includes('shrub')) return 'shrub';
    if (lower.includes('vine')) return 'vine';
    if (lower.includes('grass')) return 'grass';
    if (lower.includes('herb')) return 'herb';
    if (lower.includes('groundcover')) return 'groundcover';
  }

  if (cycle) {
    const lower = cycle.toLowerCase();
    if (lower.includes('perennial')) return 'perennial';
    if (lower.includes('annual')) return 'annual';
  }

  return undefined;
}

/**
 * Extract zone number from hardiness string (e.g., "9a" -> 9)
 */
function extractZoneNumber(zoneStr?: string): number | undefined {
  if (!zoneStr) return undefined;
  const match = zoneStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : undefined;
}

/**
 * Check if plant attracts pollinators
 */
function isPollinatorFriendly(attracts?: string[]): boolean {
  if (!attracts || attracts.length === 0) return false;

  const pollinatorKeywords = ['bee', 'butterfly', 'hummingbird', 'bird', 'pollinator'];
  return attracts.some(a =>
    pollinatorKeywords.some(k => a.toLowerCase().includes(k))
  );
}

/**
 * Fetch plant list with pagination
 */
async function fetchPlantList(page: number = 1): Promise<{ data: PerenualPlant[], hasMore: boolean }> {
  const url = `${API_BASE_URL}/species-list?key=${API_KEY}&page=${page}`;

  console.log(`Fetching page ${page}...`);

  try {
    const response = await fetch(url);

    if (response.status === 429) {
      console.warn('⚠️  Rate limit hit. Waiting 60 seconds...');
      await sleep(60000);
      return fetchPlantList(page); // Retry
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const json = (await response.json()) as Record<string, any>;
    const data = Array.isArray(json.data) ? json.data : [];
    const hasMore =
      typeof json.to === "number" &&
      typeof json.total === "number"
        ? json.to < json.total
        : false;

    console.log(`✓ Fetched ${data.length} plants from page ${page}`);

    return { data, hasMore };
  } catch (error) {
    console.error(`Error fetching page ${page}:`, error);
    throw error;
  }
}

/**
 * Fetch detailed plant information
 */
async function fetchPlantDetails(plantId: number): Promise<any> {
  const url = `${API_BASE_URL}/species/details/${plantId}?key=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (response.status === 429) {
      console.warn('⚠️  Rate limit hit. Waiting 60 seconds...');
      await sleep(60000);
      return fetchPlantDetails(plantId); // Retry
    }

    if (!response.ok) {
      console.warn(`⚠️  Could not fetch details for plant ${plantId}`);
      return null;
    }

    const detail = (await response.json()) as any;
    return {
      id: detail.id ?? null,
      common_name: detail.common_name ?? "",
      scientific_name: detail.scientific_name ?? "",
      ...detail
    };
  } catch (error) {
    console.error(`Error fetching details for plant ${plantId}:`, error);
    return null;
  }
}

/**
 * Normalize Perenual plant data to project Plant interface
 */
function normalizePlant(plant: PerenualPlant, details?: PerenualDetailResponse | null): NormalizedPlant {
  const scientificName = Array.isArray(plant.scientific_name)
    ? plant.scientific_name[0]
    : (plant.scientific_name || '');

  const id = scientificName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const imageUrl = plant.default_image?.regular_url ||
                   plant.default_image?.medium_url ||
                   plant.default_image?.small_url;

  const normalized: NormalizedPlant = {
    id,
    commonName: plant.common_name || scientificName,
    scientificName,
    imageUrl,
    sunExposure: normalizeSunExposure(plant.sunlight || details?.sunlight),
    waterNeeds: normalizeWaterNeeds(plant.watering || details?.watering),
    plantType: normalizePlantType(plant.cycle || details?.cycle, details?.type),
  };

  // Add details if available
  if (details) {
    if (details.hardiness?.min) {
      normalized.zoneMin = extractZoneNumber(details.hardiness.min);
    }
    if (details.hardiness?.max) {
      normalized.zoneMax = extractZoneNumber(details.hardiness.max);
    }
    if (details.soil_ph) {
      normalized.soilPhRange = {
        min: details.soil_ph.min || 6.0,
        max: details.soil_ph.max || 7.5
      };
    }
    if (details.flowering_season) {
      normalized.bloomPeriod = details.flowering_season;
    }
    if (details.attracts && details.attracts.length > 0) {
      normalized.pollinators = details.attracts;
      normalized.isPollinatorFriendly = isPollinatorFriendly(details.attracts);
    }
    if (details.poisonous_to_pets !== undefined) {
      normalized.toxicityToPets = details.poisonous_to_pets === 1 ? 'toxic' : 'non-toxic';
    }
    if (details.maintenance) {
      normalized.beginnerFriendly = details.maintenance.toLowerCase().includes('low');
    }
  }

  // Set defaults for missing fields
  if (!normalized.toxicityToPets) {
    normalized.toxicityToPets = 'unknown';
  }
  if (!normalized.aspcaUrl) {
    normalized.aspcaUrl = null;
  }

  return normalized;
}

/**
 * Main execution
 */
async function main() {
  console.log('🌱 Starting Perenual plant data fetch...\n');

  const allPlants: NormalizedPlant[] = [];
  let page = 1;
  let hasMore = true;

  // Fetch paginated plant list
  while (hasMore && page <= 100) { // Limit to 100 pages for safety
    try {
      const { data, hasMore: more } = await fetchPlantList(page);

      // Normalize each plant
      for (const plant of data) {
        const normalized = normalizePlant(plant);
        allPlants.push(normalized);

        // Small delay to avoid rate limits
        await sleep(100);
      }

      hasMore = more;
      page++;

      // Delay between pages
      await sleep(1000);
    } catch (error) {
      console.error('Error during fetch:', error);
      break;
    }
  }

  console.log(`\n✅ Fetched ${allPlants.length} plants total`);

  // Write to file
  const outputPath = path.join(__dirname, '..', 'data', 'perenual-raw.json');
  fs.writeFileSync(outputPath, JSON.stringify(allPlants, null, 2), 'utf-8');

  console.log(`✅ Saved to: ${outputPath}`);
  console.log('\n🎉 Done!');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
