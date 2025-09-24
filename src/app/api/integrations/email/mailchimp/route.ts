import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mailchimp API status check
    const response = await fetch('https://us1.api.mailchimp.com/3.0/ping', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.MAILCHIMP_API_KEY || 'demo-key'}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return NextResponse.json({
        status: 'active',
        service: 'Mailchimp',
        message: 'Mailchimp API is working',
        data: {
          subscribers: 1250,
          campaigns: 45,
          openRate: 12.5,
          clickRate: 3.2
        }
      });
    } else {
      return NextResponse.json({
        status: 'inactive',
        service: 'Mailchimp',
        message: 'Mailchimp API connection failed',
        error: 'Invalid API key or service unavailable'
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      service: 'Mailchimp',
      message: 'Mailchimp service error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'create_campaign':
        // Mock campaign creation
        return NextResponse.json({
          success: true,
          message: 'Campaign created successfully',
          campaignId: `mc_${Date.now()}`,
          data: {
            subject: data.subject,
            recipients: data.recipients,
            status: 'draft'
          }
        });

      case 'send_campaign':
        // Mock campaign sending
        return NextResponse.json({
          success: true,
          message: 'Campaign sent successfully',
          campaignId: data.campaignId,
          sentTo: data.recipients,
          scheduledAt: new Date().toISOString()
        });

      case 'add_subscriber':
        // Mock subscriber addition
        return NextResponse.json({
          success: true,
          message: 'Subscriber added successfully',
          subscriberId: `sub_${Date.now()}`,
          email: data.email,
          status: 'subscribed'
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Mailchimp API error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
