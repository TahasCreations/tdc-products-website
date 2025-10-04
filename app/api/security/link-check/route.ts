import { NextRequest, NextResponse } from 'next/server';
import { getWebRisk } from '@/lib/gcp';

const PROJECT_ID = process.env.GCP_PROJECT_ID;

// Threat categories from Web Risk API
const THREAT_CATEGORIES = {
  THREAT_TYPE_UNSPECIFIED: 'UNSPECIFIED',
  MALWARE: 'MALWARE',
  SOCIAL_ENGINEERING: 'SOCIAL_ENGINEERING',
  UNWANTED_SOFTWARE: 'UNWANTED_SOFTWARE',
  POTENTIALLY_HARMFUL_APPLICATION: 'POTENTIALLY_HARMFUL_APPLICATION',
  SOCIAL_ENGINEERING_INTERNAL: 'SOCIAL_ENGINEERING_INTERNAL',
  API_ABUSE: 'API_ABUSE',
  MALICIOUS_BINARY: 'MALICIOUS_BINARY',
  CSD_WHITELIST: 'CSD_WHITELIST',
  CSD_WHITELIST: 'CSD_WHITELIST',
  CSD_DOWNLOAD_WHITELIST: 'CSD_DOWNLOAD_WHITELIST',
  CLIENT_INCIDENT: 'CLIENT_INCIDENT',
  CLIENT_INCIDENT_WHITELIST: 'CLIENT_INCIDENT_WHITELIST',
  APK_MALWARE_OFFLINE: 'APK_MALWARE_OFFLINE',
  SUBRESOURCE_FILTER: 'SUBRESOURCE_FILTER',
  SUSPICIOUS: 'SUSPICIOUS',
  TRICK_TO_BILL: 'TRICK_TO_BILL',
  HIGH_CONFIDENCE_ALLOWLIST: 'HIGH_CONFIDENCE_ALLOWLIST',
  ACCURACY_TIPS: 'ACCURACY_TIPS',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({
        ok: false,
        error: 'URL is required',
      }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json({
        ok: false,
        error: 'Invalid URL format',
      }, { status: 400 });
    }

    if (!PROJECT_ID) {
      return NextResponse.json({
        ok: false,
        error: 'Web Risk not configured',
      }, { status: 500 });
    }

    console.log(`🔍 Checking URL for threats: ${url}`);

    // For testing without real GCP credentials
    if (url.includes('malware-test.com') || url.includes('phishing-test.com')) {
      return NextResponse.json({
        ok: false,
        threat: 'MALWARE',
        message: 'Test mode - malicious URL detected'
      });
    }

    const client = getWebRisk();
    const projectPath = client.projectPath(PROJECT_ID);

    // Search for threats in the URL
    const searchRequest = {
      parent: projectPath,
      uri: url,
      threatTypes: [
        'MALWARE',
        'SOCIAL_ENGINEERING',
        'UNWANTED_SOFTWARE',
        'POTENTIALLY_HARMFUL_APPLICATION',
        'SUSPICIOUS',
        'TRICK_TO_BILL',
      ],
    };

    const [response] = await client.searchUris(searchRequest);

    // Check if any threats were found
    const hasThreats = response.threat && response.threat.uris && response.threat.uris.length > 0;

    if (hasThreats) {
      const threats = response.threat!.uris!.map(threatUri => ({
        uri: threatUri.uri,
        threatTypes: threatUri.threatTypes?.map(type => THREAT_CATEGORIES[type as keyof typeof THREAT_CATEGORIES] || type) || [],
        expireTime: threatUri.expireTime,
      }));

      const primaryThreat = threats[0]; // Get the primary threat
      const threatTypes = primaryThreat.threatTypes;

      console.warn(`🚫 Threat detected for URL ${url}:`, threatTypes);

      return NextResponse.json({
        ok: false,
        threat: threatTypes[0] || 'UNKNOWN',
        threats: threatTypes,
        message: `URL flagged as ${threatTypes[0] || 'UNKNOWN'}`,
        details: {
          uri: url,
          threatTypes,
          expireTime: primaryThreat.expireTime,
        },
      });
    }

    console.log(`✅ URL check passed: ${url}`);

    return NextResponse.json({
      ok: true,
      message: 'URL is safe',
      details: {
        uri: url,
        checked: true,
      },
    });

  } catch (error) {
    console.error('💥 Web Risk check error:', error);
    
    // If Web Risk API fails, we'll be conservative and allow the URL
    // In production, you might want to implement additional fallback checks
    console.warn('⚠️ Web Risk API failed, allowing URL (fallback behavior)');
    
    return NextResponse.json({
      ok: true,
      message: 'URL check completed (fallback)',
      fallback: true,
    });
  }
}

// GET endpoint for testing
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({
        error: 'URL parameter is required',
      }, { status: 400 });
    }

    // Convert GET to POST format
    const postRequest = new NextRequest(request.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    return POST(postRequest);

  } catch (error) {
    console.error('Error in GET link check:', error);
    
    return NextResponse.json({
      error: 'Failed to check URL',
    }, { status: 500 });
  }
}

// Helper function to validate URL format
function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}

// Helper function to extract domain from URL
function extractDomain(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  } catch {
    return null;
  }
}
