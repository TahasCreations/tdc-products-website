import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Pazarlama istatistiklerini hesapla
    const stats = {
      totalCampaigns: 0,
      activeCampaigns: 0,
      totalLeads: 0,
      convertedLeads: 0,
      conversionRate: 0,
      totalSpent: 0,
      roi: 0,
      channelStats: {
        'Email': 0,
        'Sosyal Medya': 0,
        'Google Ads': 0,
        'Facebook Ads': 0,
        'Instagram': 0,
        'LinkedIn': 0,
        'Diğer': 0
      },
      campaignTypes: {
        'Email Marketing': 0,
        'Sosyal Medya': 0,
        'PPC': 0,
        'SEO': 0,
        'Content Marketing': 0,
        'Influencer': 0
      }
    };

    if (supabase) {
      // Gerçek verilerden hesapla
      const [campaignsResult, leadsResult] = await Promise.all([
        supabase.from('marketing_campaigns').select('id, status, budget, channel, campaign_type, created_at'),
        supabase.from('leads').select('id, status, source, created_at')
      ]);

      const campaigns = campaignsResult.data || [];
      const leads = leadsResult.data || [];

      // Kampanya istatistikleri
      stats.totalCampaigns = campaigns.length;
      stats.activeCampaigns = campaigns.filter(camp => camp.status === 'active').length;
      stats.totalSpent = campaigns.reduce((sum, camp) => sum + (camp.budget || 0), 0);

      // Lead istatistikleri
      stats.totalLeads = leads.length;
      stats.convertedLeads = leads.filter(lead => lead.status === 'converted').length;
      stats.conversionRate = stats.totalLeads > 0 ? (stats.convertedLeads / stats.totalLeads) * 100 : 0;

      // ROI hesaplama (basit)
      const revenue = stats.convertedLeads * 1000; // Ortalama müşteri değeri
      stats.roi = stats.totalSpent > 0 ? ((revenue - stats.totalSpent) / stats.totalSpent) * 100 : 0;

      // Kanal istatistikleri
      campaigns.forEach(campaign => {
        const channel = campaign.channel || 'Diğer';
        if (stats.channelStats[channel as keyof typeof stats.channelStats] !== undefined) {
          stats.channelStats[channel as keyof typeof stats.channelStats]++;
        } else {
          stats.channelStats['Diğer']++;
        }
      });

      // Kampanya türü istatistikleri
      campaigns.forEach(campaign => {
        const type = campaign.campaign_type || 'Diğer';
        if (stats.campaignTypes[type as keyof typeof stats.campaignTypes] !== undefined) {
          stats.campaignTypes[type as keyof typeof stats.campaignTypes]++;
        }
      });

    } else {
      // Fallback: Mock data
      stats.totalCampaigns = 25;
      stats.activeCampaigns = 8;
      stats.totalLeads = 1250;
      stats.convertedLeads = 125;
      stats.conversionRate = 10.0;
      stats.totalSpent = 50000;
      stats.roi = 150.0;
      stats.channelStats = {
        'Email': 8,
        'Sosyal Medya': 6,
        'Google Ads': 4,
        'Facebook Ads': 3,
        'Instagram': 2,
        'LinkedIn': 1,
        'Diğer': 1
      };
      stats.campaignTypes = {
        'Email Marketing': 10,
        'Sosyal Medya': 8,
        'PPC': 4,
        'SEO': 2,
        'Content Marketing': 1,
        'Influencer': 0
      };
    }

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Marketing stats error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch marketing statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
