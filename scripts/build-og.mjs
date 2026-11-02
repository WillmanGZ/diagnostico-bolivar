// Genera public/og.jpg (1200x630) para vistas previas al compartir el enlace.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#061e2c" stop-opacity=".25"/><stop offset=".55" stop-color="#061e2c" stop-opacity=".55"/><stop offset="1" stop-color="#061e2c" stop-opacity=".92"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="64" y="390" font-family="Georgia, serif" font-size="92" font-weight="700" fill="#fff">Bolívar en cifras</text>
  <text x="64" y="452" font-family="Arial, sans-serif" font-size="34" fill="#ffd9a8">Diagnóstico socioeconómico y análisis macroeconómico</text>
  <text x="64" y="560" font-family="Arial, sans-serif" font-size="26" fill="#e8eef4">PIB, inflación, desempleo e informalidad 2016-2025 frente a Colombia</text>
  <text x="64" y="598" font-family="Arial, sans-serif" font-size="22" fill="#b9c9d6">Universidad Libre · Fundamentos de Economía</text>
</svg>`);

await sharp(join(root, 'src/assets/fotos/cartagena-sector-antiguo.jpg'))
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .composite([{ input: overlay }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(join(root, 'public/og.jpg'));
await sharp(join(root, 'public/favicon.svg'), { density: 384 }).resize(180, 180).png().toFile(join(root, 'public/apple-touch-icon.png'));
console.log('public/og.jpg y apple-touch-icon.png listos');
