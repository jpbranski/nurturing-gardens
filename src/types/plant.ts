export type SunExposure = 'full-sun' | 'part-sun' | 'shade';
export type WaterNeeds = 'low' | 'medium' | 'high';
export type PlantType = 'tree' | 'shrub' | 'perennial' | 'annual' | 'vine' | 'groundcover' | 'grass' | 'herb' | 'vegetable' | 'fruit';
export type ToxicityToPets = 'non-toxic' | 'toxic' | 'unknown';

export interface Plant {
  id: string;
  commonName: string;
  scientificName: string;
  imageUrl?: string;
  zoneMin?: number;
  zoneMax?: number;
  isNative?: boolean;
  isPollinatorFriendly?: boolean;
  sunExposure?: SunExposure[];
  soilPhRange?: { min: number; max: number };
  waterNeeds?: WaterNeeds;
  plantType?: PlantType;
  bloomPeriod?: string;
  spacingInches?: number;
  plantingDepthInches?: number;
  toxicityToPets?: ToxicityToPets;
  aspcaUrl?: string;
  beginnerFriendly?: boolean;
  curatedForZones?: number[];
  notes?: string;
  description?: string;
  pollinators?: string[];
  suggestedUse?: string;
}

export interface PlantFilters {
  zone?: number;
  nativeOnly?: boolean;
  pollinatorFriendlyOnly?: boolean;
  excludeToxicToPets?: boolean;
  sunExposure?: SunExposure[];
  plantType?: PlantType[];
  waterNeeds?: WaterNeeds;
  beginnerFriendlyOnly?: boolean;
}

export interface PlantOverride {
  id: string;
  isNative?: boolean;
  isPollinatorFriendly?: boolean;
  toxicityToPets?: ToxicityToPets;
  aspcaUrl?: string;
  beginnerFriendly?: boolean;
  curatedForZones?: number[];
  notes?: string;
  pollinators?: string[];
  suggestedUse?: string;
}
