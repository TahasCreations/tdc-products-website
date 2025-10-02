// scripts/verify-next-build.js
import { existsSync } from 'node:fs';

// Kök manifest var mı? (Artık kökten beklenir)
const ok = existsSync('.next/server/app/page_client-reference-manifest.js');

if (!ok) {
  console.error('⚠️  Client-reference manifest beklenen yerde bulunamadı: .next/server/app/page_client-reference-manifest.js');
  console.error('İpucu: (marketing) route grubu kaldırıldı mı? app/page.tsx kökten render ediyor mu?');
  process.exit(1);
}

console.log('✅ Manifest bulundu.');
