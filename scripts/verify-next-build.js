// scripts/verify-next-build.js
import { existsSync } from 'node:fs';

const ok =
  existsSync('.next/server/app/page_client-reference-manifest.js') ||
  existsSync('.next/server/app/(marketing)/page_client-reference-manifest.js');

if (!ok) {
  console.error('Client reference manifest üretilmedi! Build cache/ayarları kontrol et.');
  process.exit(1);
} else {
  console.log('Manifest bulundu ✔');
}
