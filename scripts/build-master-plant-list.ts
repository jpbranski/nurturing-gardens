/**
 * BUILD MASTER PLANT LIST SCRIPT
 *
 * This script merges plant data from multiple sources:
 * 1. Perenual API data (data/perenual-raw.json)
 * 2. ASPCA toxicity data (data/aspca-toxic.json)
 * 3. Manual overrides (data/plant-overrides.json and data/overrides/*.json)
 *
 * USAGE:
 *   ts-node scripts/build-master-plant-list.ts
 *
 * REQUIREMENTS:
 *   - Run fetch-perenual.ts first
 *   - Run fetch-aspca-toxicity.ts first
 *   - Install dependencies: npm install
 *
 * OUTPUT:
 *   - data/plants.json (final authoritative plant dataset)
 */

import * as fs from 'fs';
import * as path from 'path';

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

interface AspcaEntry {
  scientificName: string;
  normalizedScientificName: string;
  commonNames: string[];
  toxicity: 'toxic' | 'non-toxic';
  aspcaUrl: string;
}

interface PlantOverride {
  id: string;
  isNative?: boolean;
  isPollinatorFriendly?: boolean;
  toxicityToPets?: string;
  aspcaUrl?: string;
  beginnerFriendly?: boolean;
  curatedForZones?: number[];
  notes?: string;
  pollinators?: string[];
  suggestedUse?: string;
  description?: string;
}

/**
 * Normalize scientific name for matching
 */
function normalizeScientificName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z\s]/g, '');
}

/**
 * Load JSON file safely
 */
function loadJsonFile<T>(filePath: string): T | null {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return null;
  }
}

/**
 * Load all override files from data/overrides/ directory
 */
function loadOverrides(overridesDir: string): PlantOverride[] {
  const overrides: PlantOverride[] = [];

  if (!fs.existsSync(overridesDir)) {
    console.warn(`⚠️  Overrides directory not found: ${overridesDir}`);
    return overrides;
  }

  const files = fs.readdirSync(overridesDir);

  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(overridesDir, file);
      const data = loadJsonFile<PlantOverride[]>(filePath);

      if (data && Array.isArray(data)) {
        overrides.push(...data);
        console.log(`✓ Loaded ${data.length} overrides from ${file}`);
      }
    }
  }

  return overrides;
}

/**
 * Find ASPCA data for a plant by scientific name
 */
function findAspcaData(
  plant: Plant,
  aspcaData: AspcaEntry[]
): AspcaEntry | undefined {
  const normalizedPlantName = normalizeScientificName(plant.scientificName);

  return aspcaData.find(entry => {
    // Direct match on normalized scientific name
    if (entry.normalizedScientificName === normalizedPlantName) {
      return true;
    }

    // Match on genus (first word)
    const plantGenus = normalizedPlantName.split(' ')[0];
    const entryGenus = entry.normalizedScientificName.split(' ')[0];

    if (plantGenus === entryGenus && plantGenus.length > 3) {
      return true;
    }

    // Match on common name
    const plantCommon = plant.commonName.toLowerCase();
    return entry.commonNames.some(
      common => common.toLowerCase() === plantCommon
    );
  });
}

/**
 * Apply overrides to a plant
 */
function applyOverrides(
  plant: Plant,
  overrides: PlantOverride[]
): Plant {
  const override = overrides.find(o => o.id === plant.id);

  if (!override) {
    return plant;
  }

  return {
    ...plant,
    ...Object.fromEntries(
      Object.entries(override).filter(([_, v]) => v !== undefined)
    )
  };
}

/**
 * Clean and validate plant data
 */
function cleanPlant(plant: Plant): Plant {
  const cleaned: Plant = { ...plant };

  // Remove null/undefined values
  Object.keys(cleaned).forEach(key => {
    const value = (cleaned as any)[key];
    if (value === null || value === undefined) {
      delete (cleaned as any)[key];
    }
  });

  // Ensure required fields
  if (!cleaned.commonName) {
    cleaned.commonName = cleaned.scientificName;
  }

  // Set defaults
  if (!cleaned.toxicityToPets) {
    cleaned.toxicityToPets = 'unknown';
  }

  // Validate zone ranges
  if (cleaned.zoneMin && cleaned.zoneMax && cleaned.zoneMin > cleaned.zoneMax) {
    const temp = cleaned.zoneMin;
    cleaned.zoneMin = cleaned.zoneMax;
    cleaned.zoneMax = temp;
  }

  return cleaned;
}

/**
 * Main execution
 */
async function main() {
  console.log('🌱 Building master plant list...\n');

  // Load Perenual data
  console.log('📥 Loading Perenual data...');
  const perenualPath = path.join(__dirname, '..', 'data', 'perenual-raw.json');
  const perenualPlants = loadJsonFile<Plant[]>(perenualPath);

  if (!perenualPlants || perenualPlants.length === 0) {
    console.error('❌ No Perenual data found. Run fetch-perenual.ts first.');
    process.exit(1);
  }

  console.log(`✓ Loaded ${perenualPlants.length} plants from Perenual`);

  // Load ASPCA toxicity data
  console.log('\n📥 Loading ASPCA toxicity data...');
  const aspcaPath = path.join(__dirname, '..', 'data', 'aspca-toxic.json');
  const aspcaData = loadJsonFile<AspcaEntry[]>(aspcaPath) || [];
  console.log(`✓ Loaded ${aspcaData.length} ASPCA toxicity entries`);

  // Load overrides
  console.log('\n📥 Loading overrides...');
  const plantOverridesPath = path.join(__dirname, '..', 'data', 'plant-overrides.json');
  const plantOverrides = loadJsonFile<PlantOverride[]>(plantOverridesPath) || [];

  const overridesDir = path.join(__dirname, '..', 'data', 'overrides');
  const additionalOverrides = loadOverrides(overridesDir);

  const allOverrides = [...plantOverrides, ...additionalOverrides];
  console.log(`✓ Loaded ${allOverrides.length} total overrides`);

  // Merge data
  console.log('\n🔄 Merging data sources...');
  const mergedPlants: Plant[] = [];

  for (const plant of perenualPlants) {
    let merged = { ...plant };

    // Apply ASPCA toxicity data
    const aspcaEntry = findAspcaData(plant, aspcaData);
    if (aspcaEntry) {
      merged.toxicityToPets = aspcaEntry.toxicity;
      merged.aspcaUrl = aspcaEntry.aspcaUrl;
    }

    // Apply overrides
    merged = applyOverrides(merged, allOverrides);

    // Clean and validate
    merged = cleanPlant(merged);

    mergedPlants.push(merged);
  }

  console.log(`✓ Merged ${mergedPlants.length} plants`);

  // Add statistics
  const stats = {
    total: mergedPlants.length,
    withImages: mergedPlants.filter(p => p.imageUrl).length,
    withZones: mergedPlants.filter(p => p.zoneMin && p.zoneMax).length,
    native: mergedPlants.filter(p => p.isNative).length,
    pollinatorFriendly: mergedPlants.filter(p => p.isPollinatorFriendly).length,
    beginnerFriendly: mergedPlants.filter(p => p.beginnerFriendly).length,
    toxic: mergedPlants.filter(p => p.toxicityToPets === 'toxic').length,
    nonToxic: mergedPlants.filter(p => p.toxicityToPets === 'non-toxic').length,
    unknownToxicity: mergedPlants.filter(p => p.toxicityToPets === 'unknown').length
  };

  console.log('\n📊 Statistics:');
  console.log(`   Total plants: ${stats.total}`);
  console.log(`   With images: ${stats.withImages}`);
  console.log(`   With zone data: ${stats.withZones}`);
  console.log(`   Native: ${stats.native}`);
  console.log(`   Pollinator-friendly: ${stats.pollinatorFriendly}`);
  console.log(`   Beginner-friendly: ${stats.beginnerFriendly}`);
  console.log(`   Toxic to pets: ${stats.toxic}`);
  console.log(`   Non-toxic to pets: ${stats.nonToxic}`);
  console.log(`   Unknown toxicity: ${stats.unknownToxicity}`);

  // Write to file
  const outputPath = path.join(__dirname, '..', 'data', 'plants.json');
  fs.writeFileSync(outputPath, JSON.stringify(mergedPlants, null, 2), 'utf-8');

  console.log(`\n✅ Saved master plant list to: ${outputPath}`);
  console.log('\n🎉 Done!');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
