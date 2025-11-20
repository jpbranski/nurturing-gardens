/**
 * MASTER ENRICHMENT SCRIPT
 *
 * This script creates a fully enriched plant database by merging data from:
 * - Perenual API (base plant data)
 * - USDA PLANTS database (native status, zones, characteristics)
 * - Pollinator plants CSV (pollinator-friendly flags)
 * - Inference rules (beginner-friendly, derived attributes)
 *
 * USAGE:
 *   ts-node -P tsconfig.scripts.json scripts/enrich-master.ts
 *
 * PREREQUISITES:
 *   1. Run fetch-perenual.ts to generate perenual-raw.json
 *   2. Run fetch-usda.ts to generate USDA data files
 *   3. Ensure pollinator-plants.csv exists
 *
 * INPUT:
 *   - data/plants.json (from build-master-plant-list.ts)
 *   - data/usda-plants.json
 *   - data/usda-characteristics.json
 *   - data/usda-distribution.json
 *   - data/pollinator-plants.csv
 *
 * OUTPUT:
 *   - data/plants-full.json (fully enriched plant database)
 */

import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { applyInference } from '../src/lib/inference';

interface Plant {
  id: string;
  commonName: string;
  scientificName: string;
  imageUrl?: string;
  zoneMin?: number;
  zoneMax?: number;
  isNative?: boolean;
  isPollinatorFriendly?: boolean;
  sunExposure?: string[];
  soilPhRange?: { min: number; max: number };
  waterNeeds?: string;
  plantType?: string;
  bloomPeriod?: string;
  spacingInches?: number;
  plantingDepthInches?: number;
  toxicityToPets?: string;
  aspcaUrl?: string;
  beginnerFriendly?: boolean;
  curatedForZones?: number[];
  notes?: string;
  description?: string;
  pollinators?: string[];
  suggestedUse?: string;
  growthHabit?: string;
  category?: string;
  temperatureMinF?: number;
  droughtTolerance?: string;
  shadeTolerance?: string;
  moistureUse?: string;
  [key: string]: any;
}

interface USDAPlant {
  symbol: string;
  scientificName: string;
  scientificNameNormalized: string;
  commonName: string;
  family: string;
  duration?: string;
  growthHabit?: string;
  nativeStatus?: string;
  isNative?: boolean;
  federalNoxious?: boolean;
}

interface USDACharacteristics {
  symbol: string;
  temperatureMinF?: number;
  droughtTolerance?: string;
  shadeTolerance?: string;
  moistureUse?: string;
  phMin?: number;
  phMax?: number;
  precipitationMin?: number;
  precipitationMax?: number;
  growthRate?: string;
  bloomPeriod?: string;
  flowerColor?: string;
  zoneMin?: number;
  zoneMax?: number;
}

interface USDADistribution {
  symbol: string;
  state: string;
  nativeStatus: string;
  isNative?: boolean;
}

interface PollinatorRecord {
  scientificName: string;
}

/**
 * Normalize scientific name for fuzzy matching
 * - Remove author citations
 * - Remove subspecies/variety markers
 * - Lowercase
 * - Remove punctuation
 * - Trim whitespace
 */
function normalizeScientificName(name: string): string {
  if (!name) return '';

  let normalized = name.trim();

  // Remove common subspecies/variety markers
  normalized = normalized
    .replace(/\s+var\.\s+.+$/i, '')
    .replace(/\s+subsp\.\s+.+$/i, '')
    .replace(/\s+ssp\.\s+.+$/i, '')
    .replace(/\s+f\.\s+.+$/i, '')
    .replace(/\s+×\s+.+$/i, '')
    .replace(/\s+x\s+.+$/i, '');

  // Remove author citations (text in parentheses or after uppercase letters)
  normalized = normalized.replace(/\s*\([^)]*\)\s*/g, ' ');
  normalized = normalized.replace(/\s+[A-Z]\.\s*.+$/g, '');

  // Keep only first two words (genus and species)
  const words = normalized.split(/\s+/).filter(w => w.length > 0);
  normalized = words.slice(0, 2).join(' ');

  // Remove punctuation and lowercase
  normalized = normalized
    .replace(/[^\w\s]/g, '')
    .toLowerCase()
    .trim();

  return normalized;
}

/**
 * Create fuzzy matching index for USDA data
 */
function createUSDAIndex(
  usdaPlants: USDAPlant[],
  usdaChars: USDACharacteristics[]
): Map<string, { plant?: USDAPlant; char?: USDACharacteristics }> {
  const index = new Map<string, { plant?: USDAPlant; char?: USDACharacteristics }>();

  // Index USDA plants by normalized scientific name
  for (const plant of usdaPlants) {
    const key = plant.scientificNameNormalized;
    if (!key) continue;

    const entry = index.get(key) || {};
    entry.plant = plant;
    index.set(key, entry);
  }

  // Index characteristics by symbol, then try to match to normalized names
  const charsBySymbol = new Map<string, USDACharacteristics>();
  for (const char of usdaChars) {
    charsBySymbol.set(char.symbol, char);
  }

  // Merge characteristics into index by symbol
  for (const [key, entry] of index.entries()) {
    if (entry.plant) {
      const char = charsBySymbol.get(entry.plant.symbol);
      if (char) {
        entry.char = char;
      }
    }
  }

  return index;
}

/**
 * Load pollinator plants from CSV
 */
function loadPollinatorSet(csvPath: string): Set<string> {
  if (!fs.existsSync(csvPath)) {
    console.warn('⚠️  pollinator-plants.csv not found, skipping pollinator enrichment');
    return new Set();
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as PollinatorRecord[];

  const pollinatorSet = new Set<string>();

  for (const record of records) {
    const normalized = normalizeScientificName(record.scientificName);
    if (normalized) {
      pollinatorSet.add(normalized);
    }
  }

  return pollinatorSet;
}

/**
 * Merge USDA data into a plant record
 */
function mergeUSDAData(
  plant: Plant,
  usdaData?: { plant?: USDAPlant; char?: USDACharacteristics }
): Plant {
  if (!usdaData) return plant;

  const enriched = { ...plant };

  // Merge plant data
  if (usdaData.plant) {
    const usda = usdaData.plant;

    // Native status (prefer USDA over existing)
    if (usda.isNative !== undefined) {
      enriched.isNative = usda.isNative;
    }

    // Growth habit and category
    if (usda.growthHabit) enriched.growthHabit = usda.growthHabit;
    if (usda.duration) enriched.category = usda.duration;

    // Add family if not present
    if (usda.family && !enriched.family) {
      enriched.family = usda.family;
    }
  }

  // Merge characteristics
  if (usdaData.char) {
    const char = usdaData.char;

    // Temperature and zones
    if (char.temperatureMinF !== undefined) {
      enriched.temperatureMinF = char.temperatureMinF;
    }

    // Prefer USDA zones if available
    if (char.zoneMin !== undefined) {
      enriched.zoneMin = char.zoneMin;
    }
    if (char.zoneMax !== undefined) {
      enriched.zoneMax = char.zoneMax;
    }

    // Tolerances
    if (char.droughtTolerance) enriched.droughtTolerance = char.droughtTolerance;
    if (char.shadeTolerance) enriched.shadeTolerance = char.shadeTolerance;
    if (char.moistureUse) enriched.moistureUse = char.moistureUse;

    // pH range
    if (char.phMin !== undefined || char.phMax !== undefined) {
      enriched.soilPhRange = {
        min: char.phMin || enriched.soilPhRange?.min || 6.0,
        max: char.phMax || enriched.soilPhRange?.max || 7.5,
      };
    }

    // Bloom period (prefer existing, fall back to USDA)
    if (!enriched.bloomPeriod && char.bloomPeriod) {
      enriched.bloomPeriod = char.bloomPeriod;
    }

    // Growth rate
    if (char.growthRate) enriched.growthRate = char.growthRate;
  }

  return enriched;
}

/**
 * Merge pollinator data into a plant record
 */
function mergePollinatorData(plant: Plant, pollinatorSet: Set<string>): Plant {
  const normalized = normalizeScientificName(plant.scientificName);

  if (pollinatorSet.has(normalized)) {
    return {
      ...plant,
      isPollinatorFriendly: true,
    };
  }

  return plant;
}

/**
 * Main execution
 */
function main() {
  console.log('🌱 Starting master enrichment...\n');

  const dataDir = path.join(__dirname, '..', 'data');

  // Define file paths
  const plantsPath = path.join(dataDir, 'plants.json');
  const usdaPlantsPath = path.join(dataDir, 'usda-plants.json');
  const usdaCharsPath = path.join(dataDir, 'usda-characteristics.json');
  const usdaDistPath = path.join(dataDir, 'usda-distribution.json');
  const pollinatorPath = path.join(dataDir, 'pollinator-plants.csv');
  const outputPath = path.join(dataDir, 'plants-full.json');

  // Check if base plants.json exists
  if (!fs.existsSync(plantsPath)) {
    console.error(`❌ Error: plants.json not found at ${plantsPath}`);
    console.error('Please run build-master-plant-list.ts first.');
    process.exit(1);
  }

  try {
    // Load base plant data
    console.log('📖 Loading base plant data...');
    const plantsData = fs.readFileSync(plantsPath, 'utf-8');
    const plants: Plant[] = JSON.parse(plantsData);
    console.log(`  ✓ Loaded ${plants.length} plants`);

    // Load USDA data (optional)
    let usdaPlants: USDAPlant[] = [];
    let usdaChars: USDACharacteristics[] = [];

    if (fs.existsSync(usdaPlantsPath)) {
      console.log('\n📖 Loading USDA plant data...');
      const usdaPlantsData = fs.readFileSync(usdaPlantsPath, 'utf-8');
      usdaPlants = JSON.parse(usdaPlantsData);
      console.log(`  ✓ Loaded ${usdaPlants.length} USDA plants`);
    } else {
      console.warn('⚠️  USDA plants data not found, skipping USDA enrichment');
    }

    if (fs.existsSync(usdaCharsPath)) {
      console.log('📖 Loading USDA characteristics...');
      const usdaCharsData = fs.readFileSync(usdaCharsPath, 'utf-8');
      usdaChars = JSON.parse(usdaCharsData);
      console.log(`  ✓ Loaded ${usdaChars.length} USDA characteristics`);
    } else {
      console.warn('⚠️  USDA characteristics not found, skipping characteristics enrichment');
    }

    // Create USDA index for fuzzy matching
    console.log('\n🔍 Creating fuzzy matching index...');
    const usdaIndex = createUSDAIndex(usdaPlants, usdaChars);
    console.log(`  ✓ Indexed ${usdaIndex.size} unique scientific names`);

    // Load pollinator data
    console.log('\n🐝 Loading pollinator data...');
    const pollinatorSet = loadPollinatorSet(pollinatorPath);
    console.log(`  ✓ Loaded ${pollinatorSet.size} pollinator-friendly plants`);

    // Enrich each plant
    console.log('\n🌺 Enriching plants...');
    let usdaMatches = 0;
    let pollinatorMatches = 0;

    const enrichedPlants = plants.map(plant => {
      // Normalize scientific name for matching
      const normalized = normalizeScientificName(plant.scientificName);

      // Merge USDA data
      const usdaData = usdaIndex.get(normalized);
      if (usdaData) {
        usdaMatches++;
        plant = mergeUSDAData(plant, usdaData);
      }

      // Merge pollinator data
      const hadPollinator = plant.isPollinatorFriendly === true;
      plant = mergePollinatorData(plant, pollinatorSet);
      if (!hadPollinator && plant.isPollinatorFriendly === true) {
        pollinatorMatches++;
      }

      // Apply inference rules
      plant = applyInference(plant) as Plant;

      return plant;
    });

    console.log(`  ✓ Matched ${usdaMatches} plants with USDA data`);
    console.log(`  ✓ Matched ${pollinatorMatches} plants with pollinator data`);

    // Calculate statistics
    const stats = {
      total: enrichedPlants.length,
      withZones: enrichedPlants.filter(p => p.zoneMin !== undefined).length,
      native: enrichedPlants.filter(p => p.isNative === true).length,
      pollinatorFriendly: enrichedPlants.filter(p => p.isPollinatorFriendly === true).length,
      beginnerFriendly: enrichedPlants.filter(p => p.beginnerFriendly === true).length,
    };

    // Save enriched data
    console.log('\n💾 Saving enriched data...');
    fs.writeFileSync(outputPath, JSON.stringify(enrichedPlants, null, 2), 'utf-8');
    console.log(`  ✅ Saved to: ${outputPath}`);

    // Print summary
    console.log('\n🎉 Master enrichment complete!');
    console.log('\n📊 Summary:');
    console.log(`  • Total plants: ${stats.total}`);
    console.log(`  • With hardiness zones: ${stats.withZones} (${((stats.withZones / stats.total) * 100).toFixed(1)}%)`);
    console.log(`  • Native plants: ${stats.native} (${((stats.native / stats.total) * 100).toFixed(1)}%)`);
    console.log(`  • Pollinator-friendly: ${stats.pollinatorFriendly} (${((stats.pollinatorFriendly / stats.total) * 100).toFixed(1)}%)`);
    console.log(`  • Beginner-friendly: ${stats.beginnerFriendly} (${((stats.beginnerFriendly / stats.total) * 100).toFixed(1)}%)`);
    console.log(`  • USDA matches: ${usdaMatches} (${((usdaMatches / stats.total) * 100).toFixed(1)}%)`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
