import { NextRequest, NextResponse } from 'next/server';
import { getRecaptcha } from '@/lib/gcp';

const PROJECT_ID = process.env.GCP_PROJECT_ID;
const SITE_KEY = process.env.RECAPTCHA_SITE_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, action } = body;

    if (!token || typeof token !== 'string') {
      return NextResponse.json({
        ok: false,
        error: 'Token is required',
      }, { status: 400 });
    }

    if (!PROJECT_ID || !SITE_KEY) {
      return NextResponse.json({
        ok: false,
        error: 'reCAPTCHA configuration missing',
      }, { status: 500 });
    }

    console.log(`🔒 Verifying reCAPTCHA token for action: ${action || 'default'}`);

    // For testing without real GCP credentials
    if (token === 'test-token') {
      return NextResponse.json({
        ok: true,
        score: 0.9,
        message: 'Test mode - reCAPTCHA bypassed'
      });
    }

    const client = getRecaptcha();
    const projectPath = client.projectPath(PROJECT_ID);

    // Create assessment
    const assessmentRequest = {
      parent: projectPath,
      assessment: {
        event: {
          token,
          siteKey: SITE_KEY,
          expectedAction: action || 'submit',
        },
      },
    };

    const [response] = await client.createAssessment(assessmentRequest);

    if (!response.riskAnalysis) {
      console.warn('⚠️ No risk analysis in reCAPTCHA response');
      return NextResponse.json({
        ok: false,
        error: 'Invalid reCAPTCHA response',
      }, { status: 500 });
    }

    const { score, reasons } = response.riskAnalysis;

    // Log the assessment details (for debugging)
    console.log(`📊 reCAPTCHA Assessment - Score: ${score}, Reasons: ${reasons?.join(', ') || 'none'}`);

    // Check if the score is acceptable (threshold: 0.3)
    // Lower scores indicate higher risk
    const isAcceptable = score !== null && score >= 0.3;

    if (!isAcceptable) {
      console.warn(`🚫 reCAPTCHA verification failed - Score: ${score}, Threshold: 0.3`);
      
      return NextResponse.json({
        ok: false,
        reason: 'high_risk',
        score,
        message: 'reCAPTCHA verification failed - high risk detected',
      });
    }

    console.log(`✅ reCAPTCHA verification successful - Score: ${score}`);

    return NextResponse.json({
      ok: true,
      score,
      reasons,
      message: 'reCAPTCHA verification successful',
    });

  } catch (error) {
    console.error('💥 reCAPTCHA verification error:', error);
    
    // Don't expose internal errors to client
    return NextResponse.json({
      ok: false,
      error: 'reCAPTCHA verification failed',
      message: 'An error occurred during verification',
    }, { status: 500 });
  }
}

// GET endpoint for testing (returns site key)
export async function GET(request: NextRequest) {
  try {
    if (!SITE_KEY) {
      return NextResponse.json({
        error: 'reCAPTCHA not configured',
      }, { status: 500 });
    }

    return NextResponse.json({
      siteKey: SITE_KEY,
      configured: true,
    });

  } catch (error) {
    console.error('Error getting reCAPTCHA config:', error);
    
    return NextResponse.json({
      error: 'Failed to get reCAPTCHA configuration',
    }, { status: 500 });
  }
}
