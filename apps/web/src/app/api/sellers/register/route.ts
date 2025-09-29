import { NextRequest, NextResponse } from 'next/server';

interface SellerRegistrationData {
  // Kişisel Bilgiler
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  
  // Şirket Bilgileri
  companyName: string;
  taxNumber: string;
  businessType: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  
  // Banka Bilgileri
  bankName: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  
  // Mağaza Bilgileri
  storeName: string;
  storeDescription: string;
  categories: string[];
  
  // Onaylar
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingAccepted: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const data: SellerRegistrationData = await request.json();

    // Validation
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'dateOfBirth',
      'companyName', 'taxNumber', 'businessType', 'address', 'city', 'country', 'postalCode',
      'bankName', 'iban', 'storeName', 'storeDescription',
      'termsAccepted', 'privacyAccepted'
    ];

    for (const field of requiredFields) {
      if (!data[field as keyof SellerRegistrationData]) {
        return NextResponse.json(
          { error: `${field} alanı zorunludur` },
          { status: 400 }
        );
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi giriniz' },
        { status: 400 }
      );
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Geçerli bir telefon numarası giriniz' },
        { status: 400 }
      );
    }

    // IBAN validation
    const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/;
    const cleanIban = data.iban.replace(/\s/g, '');
    if (!ibanRegex.test(cleanIban)) {
      return NextResponse.json(
        { error: 'Geçerli bir IBAN giriniz' },
        { status: 400 }
      );
    }

    // Generate seller ID
    const sellerId = `seller_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create seller data
    const sellerData = {
      id: sellerId,
      status: 'pending_verification',
      verificationStep: 'document_review',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
      iban: cleanIban,
      // Store documents info (files would be handled separately)
      documents: {
        identityDocument: null,
        businessLicense: null,
        taxCertificate: null,
        bankStatement: null
      },
      // Commission settings
      commissionRate: 0.08, // 8% default commission
      paymentMethod: 'escrow',
      // Store settings
      storeSettings: {
        isActive: false,
        allowInternationalShipping: false,
        autoAcceptOrders: false,
        requireOrderApproval: true
      },
      // Performance metrics
      metrics: {
        totalSales: 0,
        totalOrders: 0,
        averageRating: 0,
        totalReviews: 0,
        responseTime: 0,
        cancellationRate: 0
      }
    };

    // In a real application, you would:
    // 1. Save to database (Prisma/PostgreSQL)
    // 2. Upload documents to cloud storage
    // 3. Send verification email
    // 4. Create seller dashboard access
    // 5. Notify admin team for review

    // For now, we'll just log and return success
    console.log('New seller registration:', sellerData);

    // Simulate sending verification email
    console.log(`Verification email sent to: ${data.email}`);

    // Simulate admin notification
    console.log('Admin notification: New seller registration pending review');

    return NextResponse.json({
      success: true,
      message: 'Satıcı başvurunuz başarıyla alındı. Doğrulama süreci başlatıldı.',
      sellerId: sellerId,
      nextSteps: [
        'E-posta adresinizi doğrulayın',
        'Belgeleriniz incelenecek',
        'Hesabınız onaylandığında bilgilendirileceksiniz',
        'Satış yapmaya başlayabilirsiniz'
      ],
      estimatedReviewTime: '2-3 iş günü'
    });

  } catch (error) {
    console.error('Seller registration error:', error);
    return NextResponse.json(
      { error: 'Başvuru sırasında bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get seller registration statistics
    const stats = {
      totalApplications: 1247,
      pendingReview: 23,
      approved: 1189,
      rejected: 35,
      averageReviewTime: '1.8 gün',
      approvalRate: 97.2
    };

    return NextResponse.json({
      success: true,
      stats: stats
    });

  } catch (error) {
    console.error('Get seller stats error:', error);
    return NextResponse.json(
      { error: 'İstatistikler alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}
