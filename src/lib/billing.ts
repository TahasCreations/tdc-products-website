export type UiPlanKey = "MONTHLY_800" | "YEARLY_500_DOMAIN";

export const PLANS: Record<UiPlanKey, {
  uiName: string;
  plan: "STARTER" | "GROWTH" | "PRO";        // Prisma Plan enum'unla hizalı
  billingCycle: "MONTHLY" | "YEARLY";
  priceTRY: number;               // MONTHLY ise aylık, YEARLY ise toplam
  perMonthTRY?: number;           // sadece YEARLY için görünümde 500 yazalım
  entitlements: string[];
  includesDomain?: boolean;       // yıllık plan: domain dâhil
  commitmentMonths?: number;      // yıllık 12
}> = {
  MONTHLY_800: {
    uiName: "Aylık",
    plan: "GROWTH",
    billingCycle: "MONTHLY",
    priceTRY: 800,
    entitlements: ["keyword-tool","ads"],
  },
  YEARLY_500_DOMAIN: {
    uiName: "Yıllık (Domain Dâhil)",
    plan: "PRO",
    billingCycle: "YEARLY",
    priceTRY: 6000,     // 500 x 12 peşin
    perMonthTRY: 500,
    entitlements: ["keyword-tool","ads","domain-included"],
    includesDomain: true,
    commitmentMonths: 12,
  },
};

// Entitlement → modüller (guards.ts ile uyumlu kalır)
export const ENTITLEMENTS_DESC: Record<string, string> = {
  "keyword-tool": "Anahtar kelime analiz aracı",
  "ads": "Sponsorlu reklam kampanyaları",
  "domain-included": "Yıllık planda 1 yıllık alan adı hakkı",
};
