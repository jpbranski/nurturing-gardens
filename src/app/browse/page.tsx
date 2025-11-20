'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import ClientLayout from '@/components/layout/ClientLayout';
import PlantCard from '@/components/plants/PlantCard';
import SearchBar from '@/components/SearchBar';
import AutocompletePanel from '@/components/AutocompletePanel';
import FilterChips, { ChipFilters } from '@/components/FilterChips';
import { Plant } from '@/types/plant';
import { getAllPlants } from '@/lib/plants';
import { sortByZoneScore } from '@/lib/zoneRanking';

// Fuse.js configuration
const fuseOptions = {
  keys: [
    { name: 'commonName', weight: 2 },
    { name: 'scientificName', weight: 1.5 },
    { name: 'plantType', weight: 1.2 },
    { name: 'pollinators', weight: 0.8 },
    { name: 'sunExposure', weight: 0.8 },
    { name: 'waterNeeds', weight: 0.8 },
    { name: 'suggestedUse', weight: 0.5 },
    { name: 'description', weight: 0.4 },
  ],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 2
};

function BrowsePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const zone = searchParams?.get('zone');
  const zoneDisplay = searchParams?.get('zoneDisplay');
  const zoneNum = zone ? parseInt(zone) : undefined;

  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [chipFilters, setChipFilters] = useState<ChipFilters>({
    sunExposure: [],
    waterNeeds: null,
    specialAttributes: [],
    plantTypes: []
  });

  // Load all plants
  useEffect(() => {
    const loadPlants = async () => {
      setLoading(true);
      try {
        const allPlants = await getAllPlants();
        setPlants(allPlants);
      } catch (error) {
        console.error('Error loading plants:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlants();
  }, []);

  // Create Fuse instance
  const fuse = useMemo(() => {
    return new Fuse(plants, fuseOptions);
  }, [plants]);

  // Apply filters and search
  const filteredPlants = useMemo(() => {
    let results = [...plants];

    // Apply chip filters first
    results = results.filter(plant => {
      // Sun exposure filter (OR within category)
      if (chipFilters.sunExposure.length > 0) {
        if (!plant.sunExposure || !plant.sunExposure.some(se => chipFilters.sunExposure.includes(se))) {
          return false;
        }
      }

      // Water needs filter
      if (chipFilters.waterNeeds && plant.waterNeeds !== chipFilters.waterNeeds) {
        return false;
      }

      // Special attributes (OR within category)
      if (chipFilters.specialAttributes.length > 0) {
        let hasAttribute = false;
        if (chipFilters.specialAttributes.includes('native') && plant.isNative) hasAttribute = true;
        if (chipFilters.specialAttributes.includes('pollinator') && plant.isPollinatorFriendly) hasAttribute = true;
        if (chipFilters.specialAttributes.includes('toxic') && plant.toxicityToPets === 'toxic') hasAttribute = true;
        if (chipFilters.specialAttributes.includes('non-toxic') && plant.toxicityToPets === 'non-toxic') hasAttribute = true;
        if (chipFilters.specialAttributes.includes('beginner-friendly') && plant.beginnerFriendly) hasAttribute = true;
        if (!hasAttribute) return false;
      }

      // Plant types filter (OR within category)
      if (chipFilters.plantTypes.length > 0) {
        if (!plant.plantType || !chipFilters.plantTypes.includes(plant.plantType)) {
          return false;
        }
      }

      return true;
    });

    // Apply search if query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();

      // Check for zone search patterns (e.g., "zone 5", "zone:5", "z5")
      const zoneMatch = query.match(/(?:zone[:\s]*|^z)(\d{1,2})$/i);
      if (zoneMatch) {
        const searchZone = parseInt(zoneMatch[1]);
        if (!isNaN(searchZone) && searchZone >= 1 && searchZone <= 13) {
          results = results.filter(p =>
            p.zoneMin && p.zoneMax && searchZone >= p.zoneMin && searchZone <= p.zoneMax
          );
          return sortResults(results);
        }
      }

      // Check for attribute keywords
      const attributeKeywords = {
        native: () => results.filter(p => p.isNative),
        pollinator: () => results.filter(p => p.isPollinatorFriendly),
        toxic: () => results.filter(p => p.toxicityToPets === 'toxic'),
        'non-toxic': () => results.filter(p => p.toxicityToPets === 'non-toxic'),
        'pet safe': () => results.filter(p => p.toxicityToPets === 'non-toxic'),
        'pet friendly': () => results.filter(p => p.toxicityToPets === 'non-toxic'),
        beginner: () => results.filter(p => p.beginnerFriendly),
        'full sun': () => results.filter(p => p.sunExposure?.includes('full-sun')),
        'part sun': () => results.filter(p => p.sunExposure?.includes('part-sun')),
        shade: () => results.filter(p => p.sunExposure?.includes('shade')),
        'low water': () => results.filter(p => p.waterNeeds === 'low'),
        'medium water': () => results.filter(p => p.waterNeeds === 'medium'),
        'high water': () => results.filter(p => p.waterNeeds === 'high'),
        drought: () => results.filter(p => p.waterNeeds === 'low'),
      };

      // Check if query matches any attribute keywords
      for (const [keyword, filterFn] of Object.entries(attributeKeywords)) {
        if (query.includes(keyword)) {
          results = filterFn();
          return sortResults(results);
        }
      }

      // Fall back to fuzzy search
      const searchResults = fuse.search(searchQuery);
      const searchIds = new Set(searchResults.map(r => r.item.id));
      results = results.filter(p => searchIds.has(p.id));
    }

    return sortResults(results);
  }, [plants, chipFilters, searchQuery, fuse, zoneNum]);

  // Helper function to sort results
  const sortResults = (results: Plant[]) => {
    const sorted = [...results];

    // Apply zone ranking if zone is specified, otherwise use default sorting
    if (zoneNum) {
      return sortByZoneScore(sorted, zoneNum);
    } else {
      // Default sorting: native first, then pollinator-friendly, then beginner-friendly
      sorted.sort((a, b) => {
        // Native plants first
        if (a.isNative && !b.isNative) return -1;
        if (!a.isNative && b.isNative) return 1;

        // Then pollinator-friendly
        if (a.isPollinatorFriendly && !b.isPollinatorFriendly) return -1;
        if (!a.isPollinatorFriendly && b.isPollinatorFriendly) return 1;

        // Then beginner-friendly
        if (a.beginnerFriendly && !b.beginnerFriendly) return -1;
        if (!a.beginnerFriendly && b.beginnerFriendly) return 1;

        // Finally alphabetical by common name
        return a.commonName.localeCompare(b.commonName);
      });
      return sorted;
    }
  };

  // Autocomplete suggestions (live search before full filter)
  const autocompleteSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      return [];
    }
    const searchResults = fuse.search(searchQuery);
    return searchResults.slice(0, 5).map(r => r.item);
  }, [searchQuery, fuse]);

  const handleSelectSuggestion = (plant: Plant) => {
    setShowAutocomplete(false);
    router.push(`/plants/${plant.id}`);
  };

  return (
    <ClientLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom fontWeight={700}>
          Browse Plants
        </Typography>

        {zone && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Showing plants for Zone {zoneDisplay || zone}. Results are ranked by zone compatibility.
          </Alert>
        )}

        {/* Search Bar */}
        <Box sx={{ position: 'relative', mb: 1 }}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onFocus={() => setShowAutocomplete(true)}
            onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
            placeholder="Search plants by name, type, or characteristics..."
          />
          <AutocompletePanel
            suggestions={autocompleteSuggestions}
            onSelect={handleSelectSuggestion}
            onClose={() => setShowAutocomplete(false)}
            visible={showAutocomplete}
          />
        </Box>

        {/* Results Counter */}
        {!loading && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {filteredPlants.length} plant{filteredPlants.length !== 1 ? 's' : ''} found
          </Typography>
        )}

        {/* Filter Chips */}
        <Box sx={{ mb: 2 }}>
          <FilterChips filters={chipFilters} onChange={setChipFilters} />
        </Box>

        {/* Results */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>

            {filteredPlants.length === 0 ? (
              <Alert severity="warning" sx={{ mt: 2 }}>
                No plants match your current search and filters. Try adjusting your criteria or clearing some filters.
              </Alert>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)'
                  },
                  gap: 3,
                  mt: 2
                }}
              >
                {filteredPlants.map((plant) => (
                  <PlantCard key={plant.id} plant={plant} />
                ))}
              </Box>
            )}
          </Box>
        )}
      </Container>
    </ClientLayout>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <ClientLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </ClientLayout>
    }>
      <BrowsePageContent />
    </Suspense>
  );
}
