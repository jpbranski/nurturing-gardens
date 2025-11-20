/**
 * FETCH USDA PLANTS DATABASE SCRIPT
 *
 * This script downloads the USDA PLANTS database CSV ZIP file,
 * extracts the relevant CSV files, and converts them to JSON format.
 *
 * USAGE:
 *   ts-node -P tsconfig.scripts.json scripts/fetch-usda.ts
 *
 * OUTPUT:
 *   - data/usda-plants.json
 *   - data/usda-characteristics.json
 *   - data/usda-distribution.json
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import AdmZip from 'adm-zip';
import { parse } from 'csv-parse/sync';

const USDA_ZIP_URL = 'https://plants.sc.egov.usda.gov/assets/docs/NRCS-PLANTS-CSV.zip';
const TEMP_DIR = path.join(__dirname, '..', 'temp');
const DATA_DIR = path.join(__dirname, '..', 'data');
const ZIP_PATH = path.join(TEMP_DIR, 'usda-plants.zip');

interface USDAPlantRecord {
  Symbol: string;
  'Synonym Symbol': string;
  'Scientific Name with Author': string;
  'Common Name': string;
  Family: string;
  'Duration': string;
  'Growth Habit': string;
  'Native Status': string;
  'Federal Noxious Status': string;
  'State Noxious Status': string;
  'State Noxious Common Name': string;
  [key: string]: string;
}

interface USDACharacteristicsRecord {
  Symbol: string;
  'Temperature, Minimum (F)': string;
  'Drought Tolerance': string;
  'Shade Tolerance': string;
  'Moisture Use': string;
  'pH Minimum': string;
  'pH Maximum': string;
  'Precipitation Minimum': string;
  'Precipitation Maximum': string;
  'Growth Rate': string;
  'Bloom Period': string;
  'Flower Color': string;
  'Palatable Human': string;
  'Palatable Graze Animal': string;
  'Palatable Browse Animal': string;
  [key: string]: string;
}

interface USDADistributionRecord {
  Symbol: string;
  'State': string;
  'Native Status': string;
  [key: string]: string;
}

interface NormalizedUSDAPlant {
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

interface NormalizedUSDACharacteristics {
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

interface NormalizedUSDADistribution {
  symbol: string;
  state: string;
  nativeStatus: string;
  isNative?: boolean;
}

/**
 * Download file from URL
 */
function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`📥 Downloading from: ${url}`);

    const file = fs.createWriteStream(destPath);

    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          console.log(`↪️  Following redirect to: ${redirectUrl}`);
          file.close();
          fs.unlinkSync(destPath);

          https.get(redirectUrl, (redirectResponse) => {
            redirectResponse.pipe(file);
            file.on('finish', () => {
              file.close();
              console.log('✅ Download complete');
              resolve();
            });
          }).on('error', (err) => {
            fs.unlinkSync(destPath);
            reject(err);
          });
        } else {
          reject(new Error('Redirect with no location header'));
        }
      } else if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log('✅ Download complete');
          resolve();
        });
      } else {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
      }
    }).on('error', (err) => {
      fs.unlinkSync(destPath);
      reject(err);
    });

    file.on('error', (err) => {
      fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

/**
 * Extract specific files from ZIP
 */
function extractFromZip(zipPath: string, fileNames: string[]): Map<string, string> {
  console.log(`📦 Extracting files from ZIP...`);

  const zip = new AdmZip(zipPath);
  const zipEntries = zip.getEntries();
  const extracted = new Map<string, string>();

  for (const entry of zipEntries) {
    const entryName = entry.entryName.toLowerCase();

    // Check if this entry matches any of our target files
    for (const fileName of fileNames) {
      if (entryName.endsWith(fileName.toLowerCase())) {
        console.log(`  ✓ Found: ${entry.entryName}`);
        const content = entry.getData().toString('utf8');
        extracted.set(fileName, content);
        break;
      }
    }
  }

  return extracted;
}

/**
 * Normalize scientific name
 * - Remove subspecies and variety markers
 * - Lowercase
 * - Trim whitespace
 */
function normalizeScientificName(name: string): string {
  if (!name) return '';

  // Remove author citations (text after the second word, if it's uppercase)
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
 * Determine if plant is native based on Native Status field
 */
function determineIsNative(nativeStatus: string): boolean | undefined {
  if (!nativeStatus) return undefined;

  const status = nativeStatus.trim().toUpperCase();

  // Native status codes:
  // N = Native
  // I = Introduced
  // GP = Garden plant
  // W = Waif
  if (status.startsWith('N')) return true;
  if (status.startsWith('I')) return false;

  return undefined;
}

/**
 * Convert temperature minimum (F) to approximate hardiness zone
 * Formula: zone ≈ (tempMinF + 60) / 10
 */
function temperatureToZone(tempMinF: number): number {
  return Math.round((tempMinF + 60) / 10);
}

/**
 * Parse and normalize plants.csv
 */
function parsePlantsCSV(csvContent: string): NormalizedUSDAPlant[] {
  console.log('🌱 Parsing plants.csv...');

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as USDAPlantRecord[];

  const normalized: NormalizedUSDAPlant[] = records.map(record => {
    const scientificName = record['Scientific Name with Author'] || '';
    const nativeStatus = record['Native Status'] || '';

    return {
      symbol: record.Symbol || '',
      scientificName,
      scientificNameNormalized: normalizeScientificName(scientificName),
      commonName: record['Common Name'] || '',
      family: record.Family || '',
      duration: record.Duration || undefined,
      growthHabit: record['Growth Habit'] || undefined,
      nativeStatus: nativeStatus || undefined,
      isNative: determineIsNative(nativeStatus),
      federalNoxious: record['Federal Noxious Status'] === 'FED' || record['Federal Noxious Status'] === 'FED,LP',
    };
  });

  console.log(`  ✓ Parsed ${normalized.length} plant records`);
  return normalized;
}

/**
 * Parse and normalize characteristics.csv
 */
function parseCharacteristicsCSV(csvContent: string): NormalizedUSDACharacteristics[] {
  console.log('🌿 Parsing characteristics.csv...');

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as USDACharacteristicsRecord[];

  const normalized: NormalizedUSDACharacteristics[] = records.map(record => {
    const tempMinF = parseFloat(record['Temperature, Minimum (F)']);
    const phMin = parseFloat(record['pH Minimum']);
    const phMax = parseFloat(record['pH Maximum']);
    const precipMin = parseFloat(record['Precipitation Minimum']);
    const precipMax = parseFloat(record['Precipitation Maximum']);

    const char: NormalizedUSDACharacteristics = {
      symbol: record.Symbol || '',
    };

    // Temperature and zone calculation
    if (!isNaN(tempMinF)) {
      char.temperatureMinF = tempMinF;
      const zone = temperatureToZone(tempMinF);
      char.zoneMin = Math.max(1, Math.min(13, zone)); // Clamp to valid zones
      char.zoneMax = char.zoneMin; // Single zone for now
    }

    // Tolerances
    if (record['Drought Tolerance']) char.droughtTolerance = record['Drought Tolerance'];
    if (record['Shade Tolerance']) char.shadeTolerance = record['Shade Tolerance'];
    if (record['Moisture Use']) char.moistureUse = record['Moisture Use'];

    // pH
    if (!isNaN(phMin)) char.phMin = phMin;
    if (!isNaN(phMax)) char.phMax = phMax;

    // Precipitation
    if (!isNaN(precipMin)) char.precipitationMin = precipMin;
    if (!isNaN(precipMax)) char.precipitationMax = precipMax;

    // Growth and bloom
    if (record['Growth Rate']) char.growthRate = record['Growth Rate'];
    if (record['Bloom Period']) char.bloomPeriod = record['Bloom Period'];
    if (record['Flower Color']) char.flowerColor = record['Flower Color'];

    return char;
  });

  console.log(`  ✓ Parsed ${normalized.length} characteristics records`);
  return normalized;
}

/**
 * Parse and normalize distribution.csv
 */
function parseDistributionCSV(csvContent: string): NormalizedUSDADistribution[] {
  console.log('🗺️  Parsing distribution.csv...');

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as USDADistributionRecord[];

  const normalized: NormalizedUSDADistribution[] = records.map(record => {
    const nativeStatus = record['Native Status'] || '';

    return {
      symbol: record.Symbol || '',
      state: record.State || '',
      nativeStatus,
      isNative: determineIsNative(nativeStatus),
    };
  });

  console.log(`  ✓ Parsed ${normalized.length} distribution records`);
  return normalized;
}

/**
 * Main execution
 */
async function main() {
  console.log('🌱 Starting USDA PLANTS database fetch...\n');

  // Ensure directories exist
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  try {
    // Download ZIP file
    await downloadFile(USDA_ZIP_URL, ZIP_PATH);

    // Extract CSV files
    const targetFiles = ['plants.csv', 'characteristics.csv', 'distribution.csv'];
    const extractedFiles = extractFromZip(ZIP_PATH, targetFiles);

    // Verify all files were found
    const missingFiles = targetFiles.filter(f => !extractedFiles.has(f));
    if (missingFiles.length > 0) {
      console.warn(`⚠️  Warning: Could not find files: ${missingFiles.join(', ')}`);
    }

    // Parse and normalize each CSV
    const plants = extractedFiles.has('plants.csv')
      ? parsePlantsCSV(extractedFiles.get('plants.csv')!)
      : [];

    const characteristics = extractedFiles.has('characteristics.csv')
      ? parseCharacteristicsCSV(extractedFiles.get('characteristics.csv')!)
      : [];

    const distribution = extractedFiles.has('distribution.csv')
      ? parseDistributionCSV(extractedFiles.get('distribution.csv')!)
      : [];

    // Save JSON files
    const plantsPath = path.join(DATA_DIR, 'usda-plants.json');
    const charPath = path.join(DATA_DIR, 'usda-characteristics.json');
    const distPath = path.join(DATA_DIR, 'usda-distribution.json');

    fs.writeFileSync(plantsPath, JSON.stringify(plants, null, 2), 'utf-8');
    console.log(`✅ Saved ${plants.length} plants to: ${plantsPath}`);

    fs.writeFileSync(charPath, JSON.stringify(characteristics, null, 2), 'utf-8');
    console.log(`✅ Saved ${characteristics.length} characteristics to: ${charPath}`);

    fs.writeFileSync(distPath, JSON.stringify(distribution, null, 2), 'utf-8');
    console.log(`✅ Saved ${distribution.length} distribution records to: ${distPath}`);

    // Clean up temp files
    console.log('\n🧹 Cleaning up temporary files...');
    if (fs.existsSync(ZIP_PATH)) {
      fs.unlinkSync(ZIP_PATH);
    }
    if (fs.existsSync(TEMP_DIR) && fs.readdirSync(TEMP_DIR).length === 0) {
      fs.rmdirSync(TEMP_DIR);
    }

    console.log('\n🎉 USDA data fetch complete!');
    console.log('\n📊 Summary:');
    console.log(`  • Plants: ${plants.length}`);
    console.log(`  • Characteristics: ${characteristics.length}`);
    console.log(`  • Distribution: ${distribution.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
