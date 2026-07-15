/**
 * Generate PWA icons from favicon.svg:
 *   - icon-192.png  (192x192, purpose: any)
 *   - icon-512.png  (512x512, purpose: any)
 *   - icon-maskable-512.png (512x512, purpose: maskable — full-bleed bg, icon in 80% safe zone)
 *
 * Run: node scripts/generate-pwa-icons.mjs
 */
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const svgPath = resolve(root, 'src/assets/favicons/favicon.svg');
const outDir = resolve(root, 'public/icons');

const svgBuffer = readFileSync(svgPath);

// --- Standard icons (transparent background, icon fills canvas) ---
// Scale the 32x32 viewBox up to target size.
await sharp(svgBuffer, { density: 384 })
  .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(resolve(outDir, 'icon-192.png'));

await sharp(svgBuffer, { density: 384 })
  .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(resolve(outDir, 'icon-512.png'));

// --- Maskable icon (full-bleed background, icon in 80% safe zone) ---
// The favicon.svg already has a rounded-rect background (#1a1813).
// For maskable, we fill the entire canvas with that bg color and place
// the icon at 80% size centered (safe zone = center 80%).
const maskableBg = '#1a1813';
const iconSize = Math.round(512 * 0.80); // 410px — safe zone

// Composite: bg full-bleed + icon centered at 80%
const iconLayer = await sharp(svgBuffer, { density: 384 })
  .resize(iconSize, iconSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

await sharp({
  create: {
    width: 512,
    height: 512,
    channels: 4,
    background: maskableBg,
  },
})
  .composite([{ input: iconLayer, gravity: 'center' }])
  .png()
  .toFile(resolve(outDir, 'icon-maskable-512.png'));

// Also a 192 maskable for broader device support
const iconLayer192 = await sharp(svgBuffer, { density: 384 })
  .resize(Math.round(192 * 0.80), Math.round(192 * 0.80), { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

await sharp({
  create: {
    width: 192,
    height: 192,
    channels: 4,
    background: maskableBg,
  },
})
  .composite([{ input: iconLayer192, gravity: 'center' }])
  .png()
  .toFile(resolve(outDir, 'icon-maskable-192.png'));

console.log('PWA icons generated in public/icons/:');
console.log('  icon-192.png, icon-512.png, icon-maskable-192.png, icon-maskable-512.png');
