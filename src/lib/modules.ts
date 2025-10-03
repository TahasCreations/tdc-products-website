import { MODULES } from "./permissions";
import { auth } from "./auth";
import { getActivePlanForUser } from "./guards";

// Plan → entitlement haritası
const PLAN_ENTITLEMENTS = {
  FREE:    [],
  STARTER: ["analytics-lite"],
  GROWTH:  ["analytics-lite","keyword-tool"],
  PRO:     ["analytics-lite","keyword-tool","bulk-upload"],
} as const;

export async function getVisibleModules() {
  const session = await auth();
  if (!session?.user) return [];
  
  const role = (session.user as any).role ?? "BUYER";
  
  // ADMIN tüm admin modüllerini görür
  if (role === "ADMIN") {
    return MODULES.filter(m => m.roles.includes("ADMIN"));
  }

  // SELLER için plan kontrolü
  if (role === "SELLER") {
    const plan = await getActivePlanForUser(session.user.id as string);
    const allowed = new Set(PLAN_ENTITLEMENTS[plan] || []);
    
  return MODULES.filter(m => 
    m.roles.includes("SELLER") && 
    (!m.entitlements || m.entitlements.every(e => allowed.has(e as any)))
  );
  }

  return [];
}
