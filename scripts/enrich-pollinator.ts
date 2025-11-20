/**
 * ENRICH POLLINATOR DATA SCRIPT
 *
 * This script enriches plant data with pollinator-friendly flags
 * based on the curated pollinator-plants.csv file.
 *
 * USAGE:
 *   ts-node -P tsconfig.scripts.json scripts/enrich-pollinator.ts
 *
 * INPUT:
 *   - data/plants.json (master plant list)
 *   - data/pollinator-plants.csv (curated pollinator-friendly plants)
 *
 * OUTPUT:
 *   - Updates plants in memory (for use in enrich-master.ts)
 */

import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

interface Plant {
  id: string;
  commonName: string;
  scientificName: string;
  isPollinatorFriendly?: boolean;
  [key: string]: any;
}

interface PollinatorRecord {
  scientificName: string;
}

/**
 * Normalize scientific name for matching
 * - Remove subspecies and variety markers
 * - Lowercase
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
    .replace(/\s+×\s+.+$/i, '');

  // Keep only first two words (genus and species)
  const words = normalized.split(/\s+/).filter(w => w.length > 0);
  normalized = words.slice(0, 2).join(' ');

  // Lowercase and trim
  return normalized.toLowerCase().trim();
}

/**
 * Load pollinator plants from CSV
 */
function loadPollinatorPlants(csvPath: string): Set<string> {
  console.log('🐝 Loading pollinator plants from CSV...');

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

  console.log(`  ✓ Loaded ${pollinatorSet.size} pollinator-friendly plants`);
  return pollinatorSet;
}

/**
 * Enrich plants with pollinator data
 */
function enrichPlantsWithPollinator(
  plants: Plant[],
  pollinatorSet: Set<string>
): { enriched: number; total: number } {
  console.log('🌺 Enriching plants with pollinator data...');

  let enrichedCount = 0;

  for (const plant of plants) {
    const normalized = normalizeScientificName(plant.scientificName);

    if (pollinatorSet.has(normalized)) {
      plant.isPollinatorFriendly = true;
      enrichedCount++;
    }
  }

  console.log(`  ✓ Marked ${enrichedCount} plants as pollinator-friendly`);
  return { enriched: enrichedCount, total: plants.length };
}

/**
 * Main execution
 */
function main() {
  console.log('🌱 Starting pollinator enrichment...\n');

  const dataDir = path.join(__dirname, '..', 'data');
  const plantsPath = path.join(dataDir, 'plants.json');
  const pollinatorPath = path.join(dataDir, 'pollinator-plants.csv');

  // Check if input files exist
  if (!fs.existsSync(plantsPath)) {
    console.error(`❌ Error: plants.json not found at ${plantsPath}`);
    console.error('Please run build-master-plant-list.ts first.');
    process.exit(1);
  }

  if (!fs.existsSync(pollinatorPath)) {
    console.error(`❌ Error: pollinator-plants.csv not found at ${pollinatorPath}`);
    process.exit(1);
  }

  try {
    // Load plants
    const plantsData = fs.readFileSync(plantsPath, 'utf-8');
    const plants: Plant[] = JSON.parse(plantsData);
    console.log(`📖 Loaded ${plants.length} plants from plants.json`);

    // Load pollinator plants
    const pollinatorSet = loadPollinatorPlants(pollinatorPath);

    // Enrich plants
    const result = enrichPlantsWithPollinator(plants, pollinatorSet);

    // Save enriched data
    fs.writeFileSync(plantsPath, JSON.stringify(plants, null, 2), 'utf-8');
    console.log(`\n✅ Saved enriched data to: ${plantsPath}`);

    console.log('\n🎉 Pollinator enrichment complete!');
    console.log('\n📊 Summary:');
    console.log(`  • Total plants: ${result.total}`);
    console.log(`  • Pollinator-friendly: ${result.enriched}`);
    console.log(`  • Percentage: ${((result.enriched / result.total) * 100).toFixed(1)}%`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
