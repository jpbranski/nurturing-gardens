import { NextRequest, NextResponse } from 'next/server';
import { ZoneInfo } from '@/types/zone';

// Mock zone data for development
// In production, this would connect to a real USDA zone API
const mockZoneData: Record<string, ZoneInfo> = {
  '10001': { zip: '10001', zone: '7b', zoneNumber: 7, zoneLetter: 'b' },
  '90210': { zip: '90210', zone: '10b', zoneNumber: 10, zoneLetter: 'b' },
  '60601': { zip: '60601', zone: '6a', zoneNumber: 6, zoneLetter: 'a' },
  '02108': { zip: '02108', zone: '6b', zoneNumber: 6, zoneLetter: 'b' },
  '33101': { zip: '33101', zone: '10b', zoneNumber: 10, zoneLetter: 'b' },
  '98101': { zip: '98101', zone: '9a', zoneNumber: 9, zoneLetter: 'a' },
  '78701': { zip: '78701', zone: '9a', zoneNumber: 9, zoneLetter: 'a' },
  '30301': { zip: '30301', zone: '8a', zoneNumber: 8, zoneLetter: 'a' },
  '80201': { zip: '80201', zone: '5b', zoneNumber: 5, zoneLetter: 'b' },
  '85001': { zip: '85001', zone: '9b', zoneNumber: 9, zoneLetter: 'b' },
};

async function fetchZoneFromAPI(zip: string): Promise<ZoneInfo | null> {
  const baseUrl = process.env.ZONE_API_BASE_URL;
  const apiKey = process.env.ZONE_API_KEY;

  if (!baseUrl || !apiKey) {
    console.warn('Zone API not configured, using mock data');
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}?zip=${zip}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Zone API error: ${response.status}`);
    }

    const data = await response.json();

    // Map API response to our ZoneInfo interface
    // Adjust this based on actual API response structure
    return {
      zip,
      zone: data.zone || data.hardiness_zone,
      zoneNumber: parseInt(data.zone || data.hardiness_zone),
      zoneLetter: data.zone_letter,
    };
  } catch (error) {
    console.error('Failed to fetch from zone API:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const zip = searchParams.get('zip');

  if (!zip) {
    return NextResponse.json(
      { error: 'ZIP code is required' },
      { status: 400 }
    );
  }

  // Validate ZIP code format (basic US ZIP validation)
  if (!/^\d{5}$/.test(zip)) {
    return NextResponse.json(
      { error: 'Invalid ZIP code format. Please provide a 5-digit US ZIP code.' },
      { status: 400 }
    );
  }

  // Try to fetch from external API first
  let zoneInfo = await fetchZoneFromAPI(zip);

  // Fall back to mock data if API is not available
  if (!zoneInfo) {
    zoneInfo = mockZoneData[zip];

    // If not in mock data, use a reasonable default based on ZIP ranges
    if (!zoneInfo) {
      // This is a very simplified approach - in production, use real data
      const zipNum = parseInt(zip);
      let zone = '6a';
      let zoneNumber = 6;

      if (zipNum >= 85000 && zipNum <= 99999) {
        zone = '9a';
        zoneNumber = 9;
      } else if (zipNum >= 70000 && zipNum <= 84999) {
        zone = '7b';
        zoneNumber = 7;
      } else if (zipNum >= 60000 && zipNum <= 69999) {
        zone = '5b';
        zoneNumber = 5;
      } else if (zipNum >= 30000 && zipNum <= 59999) {
        zone = '7a';
        zoneNumber = 7;
      } else if (zipNum >= 20000 && zipNum <= 29999) {
        zone = '7a';
        zoneNumber = 7;
      }

      zoneInfo = {
        zip,
        zone,
        zoneNumber,
        zoneLetter: zone.slice(-1),
      };
    }
  }

  return NextResponse.json(zoneInfo);
}
