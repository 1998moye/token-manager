// generate-icons.js
// Generates plugin icons for Token 管理器
// Deep blue circular background (#1a73e8) + white "K" letter

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, 'public', 'icons');

// Icon sizes required for Edge extension
const SIZES = [16, 32, 48, 128];

// Colors
const BG_COLOR = '#1a73e8';
const TEXT_COLOR = '#ffffff';

/**
 * Generate SVG string for a circular icon with "K" letter
 * @param {number} size - Icon size in pixels
 * @returns {string} SVG string
 */
function generateSVG(size) {
  const center = size / 2;
  // Font size is proportional to icon size
  const fontSize = size * 0.55;

  // ViewBox padding to prevent clipping
  const padding = size * 0.08;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4285f4;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a56db;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- Circular background with subtle gradient -->
  <circle cx="${center}" cy="${center}" r="${center - 1}" fill="url(#grad)" />
  <!-- White "K" letter centered -->
  <text
    x="${center}"
    y="${center}"
    font-family="Arial, sans-serif"
    font-size="${fontSize}"
    font-weight="bold"
    fill="${TEXT_COLOR}"
    text-anchor="middle"
    dominant-baseline="central"
  >K</text>
</svg>`;
}

/**
 * Generate an icon at the specified size
 * @param {number} size - Icon size in pixels
 */
async function generateIcon(size) {
  const svg = generateSVG(size);
  const filename = `icon${size}.png`;
  const outputPath = path.join(OUTPUT_DIR, filename);

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);

  const stats = fs.statSync(outputPath);
  console.log(`Generated ${filename} (${stats.size} bytes)`);
}

/**
 * Main function - generate all icons
 */
async function main() {
  console.log('Generating icons for Token 管理器...\n');

  for (const size of SIZES) {
    await generateIcon(size);
  }

  console.log('\nAll icons generated successfully!');
}

main().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
