/**
 * KVKK (Kişisel Verilerin Korunması Kanunu) Uyumluluk Sistemi
 * 
 * Türkiye'deki KVKK yasasına uyum için gerekli tüm fonksiyonları içerir.
 */

import { prisma } from "@/lib/prisma";

export interface KVKKConsentData {
  userId: string;
  consentType: 'kvkk' | 'cookies' | 'marketing' | 'analytics' | 'functional';
  consentStatus: boolean;
  ipAddress?: string;
  userAgent?: string;
  consentText?: string;
  metadata?: Record<string, any>;
}

export interface UserDataExport {
  profile: any;
  orders: any[];
  reviews: any[];
  addresses: any[];
  wishlist: any[];
  consentLogs: any[];
  exportDate: string;
}

export class KVKKCompliance {
  /**
   * KVKK onayını kaydet
   */
  static async recordConsent(data: KVKKConsentData): Promise<void> {
    await prisma.consentLog.create({
      data: {
        userId: data.userId,
        consentType: data.consentType,
        consentStatus: data.consentStatus,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        consentText: data.consentText,
        metadata: data.metadata || {},
      },
    });
  }

  /**
   * Kullanıcının onay durumunu kontrol et
   */
  static async getConsentStatus(
    userId: string,
    consentType: KVKKConsentData['consentType']
  ): Promise<boolean> {
    const latestConsent = await prisma.consentLog.findFirst({
      where: {
        userId,
        consentType,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return latestConsent?.consentStatus ?? false;
  }

  /**
   * Kullanıcının tüm onay geçmişini getir
   */
  static async getConsentHistory(userId: string) {
    return await prisma.consentLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Kullanıcı verilerini export et (Veri Taşınabilirliği Hakkı)
   */
  static async exportUserData(userId: string): Promise<UserDataExport> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders: {
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    title: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
        reviews: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        addresses: true,
        wishlistItems: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                price: true,
              },
            },
          },
        },
        consentLogs: true,
      },
    });

    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }

    return {
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      orders: user.orders.map((order) => ({
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          productTitle: item.product?.title,
          quantity: item.qty,
          price: item.unitPrice,
        })),
      })),
      reviews: user.reviews.map((review) => ({
        productTitle: review.product?.title,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      })),
      addresses: user.addresses,
      wishlist: user.wishlistItems.map((item) => ({
        productTitle: item.product?.title,
        addedAt: item.createdAt,
      })),
      consentLogs: user.consentLogs,
      exportDate: new Date().toISOString(),
    };
  }

  /**
   * Kullanıcı verilerini sil/anonimleştir (Unutulma Hakkı)
   */
  static async anonymizeUser(userId: string): Promise<void> {
    const anonymousId = `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Kullanıcıyı anonimleştir
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: `${anonymousId}@deleted.local`,
        name: 'Silinmiş Kullanıcı',
        phone: null,
        isActive: false,
        // Not: password'u sıfırlamıyoruz, sadece anonimleştiriyoruz
      },
    });

    // İlişkili verileri anonimleştir
    await prisma.order.updateMany({
      where: { userId },
      data: {
        customerInfo: {
          firstName: 'Silinmiş',
          lastName: 'Kullanıcı',
          email: `${anonymousId}@deleted.local`,
        },
      },
    });

    // Onay kayıtlarını silme (yasal zorunluluk için saklanabilir)
    // await prisma.consentLog.deleteMany({
    //   where: { userId }
    // });
  }

  /**
   * KVKK aydınlatma metni versiyonunu getir
   */
  static getKVKKText(version: string = '1.0'): string {
    // Bu metin gerçek KVKK aydınlatma metni olmalıdır
    // Hukuk danışmanı ile hazırlanmalıdır
    return `
# KVKK AYDINLATMA METNİ

**Versiyon:** ${version}  
**Son Güncelleme:** ${new Date().toLocaleDateString('tr-TR')}

## 1. VERİ SORUMLUSU

TDC Market olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla kişisel verilerinizi aşağıda açıklanan çerçevede işlemekteyiz.

**Firma Adı:** TDC Market  
**Adres:** [Firma Adresi]  
**Telefon:** [Telefon]  
**E-posta:** kvkk@tdcmarket.com

## 2. İŞLENEN KİŞİSEL VERİLER

Aşağıdaki kategorilerdeki kişisel verileriniz işlenmektedir:

- **Kimlik Bilgileri:** Ad, soyad, T.C. kimlik numarası
- **İletişim Bilgileri:** E-posta adresi, telefon numarası, adres bilgileri
- **Müşteri İşlem Bilgileri:** Sipariş geçmişi, ödeme bilgileri, fatura bilgileri
- **Pazarlama Bilgileri:** İletişim tercihleri, kampanya katılımları
- **İnternet Sitesi Kullanım Bilgileri:** IP adresi, çerez bilgileri, tarayıcı bilgileri

## 3. KİŞİSEL VERİLERİN İŞLENME AMAÇLARI

Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:

- E-ticaret hizmetlerinin sunulması
- Siparişlerin işlenmesi ve teslimat
- Müşteri hizmetleri faaliyetlerinin yürütülmesi
- Yasal yükümlülüklerin yerine getirilmesi
- Pazarlama ve tanıtım faaliyetleri (onayınız dahilinde)
- İstatistiksel analizler ve raporlama

## 4. KİŞİSEL VERİLERİN AKTARILMASI

Kişisel verileriniz, yukarıda belirtilen amaçların gerçekleştirilmesi için:

- Kargo firmalarına
- Ödeme kuruluşlarına
- E-fatura sistemlerine
- Yasal yükümlülükler çerçevesinde ilgili kamu kurumlarına

aktarılabilmektedir.

## 5. KİŞİSEL VERİLERİNİZİN SAKLANMA SÜRESİ

Kişisel verileriniz, işleme amacının gerektirdiği süre boyunca ve yasal saklama süreleri çerçevesinde saklanmaktadır.

## 6. KVKK KAPSAMINDAKİ HAKLARINIZ

KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:

- Kişisel verilerinizin işlenip işlenmediğini öğrenme
- İşlenmişse bilgi talep etme
- İşleme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme
- Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme
- Eksik veya yanlış işlenmişse düzeltilmesini isteme
- KVKK'da öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme
- Düzeltme, silme, yok etme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme
- İşlenen verilerin münhasıran otomatik sistemler ile analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme
- Kanuna aykırı işleme nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme

## 7. HAKLARINIZI NASIL KULLANABİLİRSİNİZ?

Haklarınızı kullanmak için:

- E-posta: kvkk@tdcmarket.com
- Adres: [Firma Adresi]
- KVKK Başvuru Formu: /kvkk/basvuru

## 8. ÇEREZLER

Web sitemizde çerezler kullanılmaktadır. Çerez politikamız için: /cerez-politikasi

## 9. DEĞİŞİKLİKLER

Bu aydınlatma metni, yasal düzenlemelerdeki değişiklikler nedeniyle güncellenebilir. Güncel versiyon her zaman web sitemizde yayınlanmaktadır.

---

**Bu metni okudum, anladım ve kişisel verilerimin işlenmesine onay veriyorum.**
    `.trim();
  }

  /**
   * Mesafeli satış sözleşmesi onayını kaydet
   */
  static async recordDistanceSalesAgreement(
    userId: string,
    orderId: string | null,
    agreementVersion: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await prisma.distanceSalesAgreement.create({
      data: {
        userId,
        orderId,
        agreementVersion,
        ipAddress,
        userAgent,
        isAccepted: true,
      },
    });
  }

  /**
   * Sipariş için mesafeli satış sözleşmesi onayını kontrol et
   */
  static async checkDistanceSalesAgreement(
    orderId: string
  ): Promise<boolean> {
    const agreement = await prisma.distanceSalesAgreement.findFirst({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });

    return agreement?.isAccepted ?? false;
  }
}



