// Script to generate high quality pixel art icons and a preview HTML
import fs from 'fs';

// Helper to compile pixel art matrix into SVG
function buildSvg(matrix, palette, size = 32) {
  let rects = [];
  for (let y = 0; y < matrix.length; y++) {
    const row = matrix[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      const color = palette[ch];
      if (color) {
        rects.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${color}" />`);
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%" shape-rendering="crispEdges">
  ${rects.join('\n  ')}
</svg>`;
}

// -------------------------------------------------------------
// ICON 1: Iconic 5-Petal Sakura Blossom with deep outline & golden core
// -------------------------------------------------------------
const palBlossom = {
  '.': null,
  'K': '#38040e', // Deep contour (works on dark and light mode)
  'D': '#9f1239', // Petal deep shade
  'M': '#e11d48', // Petal mid red-pink
  'R': '#f43f5e', // Vibrant rose
  'L': '#fb7185', // Light sakura pink
  'S': '#f472b6', // Soft pink
  'P': '#fbcfe8', // Pale blush
  'W': '#ffffff', // Crisp white highlight
  'Y': '#fef08a', // Bright pollen
  'G': '#f59e0b', // Gold stamen
  'C': '#b45309', // Center core
  'A': '#7c2d12', // Stamen stalk
};

const matrixBlossom = [
  "................................",
  "...........KK......KK...........",
  "..........KPPK....KPPK..........",
  ".........KWWLPK..KPLWWK.........",
  "........KWWLLLPKKLLLWWWK........",
  "........KWLLLLMMMMLLLLWK........",
  "........KWLLLMDDDDMLLLLWK.......",
  "........KWLLMD....DMLLLKK.......",
  "...KKK...KWMD......DMLK..KKK....",
  "..KPPPK..KMD........DMK.KPPPK...",
  ".KWWLPK..KMD........DMK.KPLWWK..",
  "KWWLLLPKKKD..........DKKLLLWWWK.",
  "KWLLLLMMD..............DMMLLLLWK",
  "KWLLLMDD................DDMLLLWK",
  "KWLLMD.....KYYAAAAKK.....DMLLLKK",
  ".KWLMD....KYYGGGGYYK.....DMLK...",
  "..KMD....KYGGCCCCGGYK....DMK....",
  "..KMD....KYGGCCCCGGYK....DMK....",
  ".KWLMD....KYYGGGGYYK.....DMLK...",
  "KWLLMD.....KYYAAAAKK.....DMLLLKK",
  "KWLLLMDD................DDMLLLWK",
  "KWLLLLMMD..............DMMLLLLWK",
  "KWWLLLPKKKD..........DKKLLLWWWK.",
  ".KWWLPK..KMD........DMK.KPLWWK..",
  "..KPPPK..KMD........DMK.KPPPK...",
  "...KKK...KWMD......DMLK..KKK....",
  "........KWLLMD....DMLLLKK.......",
  "........KWLLLMDDDDMLLLLWK.......",
  "........KWLLLLMMMMLLLLWK........",
  "........KWWLLLPKKLLLWWWK........",
  ".........KWWLPK..KPLWWK.........",
  "..........KPPK....KPPK.........."
];

// Let's also create the TORII GATE + SAKURA BLOSSOM (Iconic Shrine Garden)
// Palette:
// S: Sky dark indigo (#1a1a2e)
// K: Dark torii roof (#111827)
// G: Gold finial / ornament (#fbbf24)
// R: Bright torii red (#ef4444)
// D: Dark torii red (#b91c1c)
// C: Crimson shadow (#881337)
// B: Stone base (#475569)
// P: Sakura pink (#f472b6)
// L: Sakura light (#fbcfe8)
// W: Sakura white (#ffffff)
// Y: Sakura gold center (#fef08a)
// M: Moon/Sun (#fef3c7)
// O: Moon glow (#fde68a)
const palTorii = {
  '.': null,
  'K': '#111827', // Black lacquered top
  'G': '#f59e0b', // Gold finial tips
  'R': '#ef4444', // Vermilion torii
  'D': '#b91c1c', // Deep torii red
  'C': '#7f1d1d', // Torii dark shadow
  'B': '#334155', // Base stone
  'L': '#1e293b', // Base dark
  'P': '#fb7185', // Sakura pink
  'Q': '#f472b6', // Sakura mid
  'S': '#fbcfe8', // Sakura pale
  'W': '#ffffff', // Highlight
  'Y': '#fef08a', // Center gold
  'O': '#d97706', // Gold dark
  'T': '#4c0519', // Flower outline
  'M': '#fffbeb', // Moon light
  'N': '#fde68a', // Moon ring
};

const matrixTorii = [
  "................................",
  "....GG....................GG....",
  "...GKKKKKKKKKKKKKKKKKKKKKKKKG...",
  "....CKRRRRRRRRRRRRRRRRRRRRKC....",
  ".....CDDDDDDDDDDDDDDDDDDDDDC....",
  "........CDDDDDDDDDDDDDDDC.......",
  ".......CDRRRRRRRRRRRRRRDC.......",
  ".......CKK............KKC.......",
  ".....GGCDDGG........GGCDDGG.....",
  "....GKRRRRRKG......GKRRRRRKG....",
  "....CDDDDDDDG......GDDDDDDDC....",
  ".......CDD............DDC.......",
  ".......CDD...TSSSSST..DDC.......",
  ".......CDD..TSWWWWSST.DDC.......",
  ".......CDD.TSWPQQPWST.DDC.......",
  ".......CDD.TSPQYYQPST.DDC.......",
  ".......CDD.TSPQYYQPST.DDC.......",
  "..TSS..CDD.TSWPQQPWST.DDC.......",
  ".TSWST.CDD..TSWWWWSST.DDC.......",
  ".TSQPSTCDD...TSSSSST..DDC.......",
  "..TST..CDD............DDC.......",
  ".......CDD............DDC.......",
  ".......CDD............DDC...TSS.",
  ".......CDD............DDC..TSWST",
  ".......CDD............DDC..TSPT.",
  ".......CDD............DDC...TT..",
  ".......CDD............DDC.......",
  "......LBBBL..........LBBBL......",
  "......LBBBL..........LBBBL......",
  "......LLLLL..........LLLLL......",
  "................................",
  "................................"
];

// ICON 3: Sakura Blossom badge with Torii emblem + golden retro frame
// 32x32 retro badge
const palBadge = {
  '.': null,
  'F': '#f3c66a', // Gold border
  'O': '#d97706', // Dark gold border
  'Z': '#1a1016', // Dark sanctuary night background
  'R': '#e11d48', // Torii red
  'D': '#9f1239', // Torii deep red
  'K': '#18181b', // Roof black
  'P': '#fb7185', // Sakura pink
  'L': '#fbcfe8', // Pale pink
  'W': '#ffffff', // White shine
  'Y': '#fef08a', // Gold stamen
  'C': '#751d32', // Crimson outline
};

const matrixBadge = [
  "....FFFFFFFFFFFFFFFFFFFFFFFF....",
  "...FOZZZZZZZZZZZZZZZZZZZZZZOF...",
  "..FOZZZZZZZZZZZZZZZZZZZZZZZZOF..",
  ".FOZZZZZZZZZZZZZZZZZZZZZZZZZZOF.",
  "FOZZZZKKKKKKKKKKKKKKKKKKKKZZZZOF",
  "FOZZZZZRRRRRRRRRRRRRRRRRRZZZZZOF",
  "FOZZZZZZDDDDDDDDDDDDDDDDZZZZZZOF",
  "FOZZZZZZCDDRRRRRRRRRRDDCZZZZZZOF",
  "FOZZZZZZCDDZZZZZZZZZZDDCZZZZZZOF",
  "FOZZZZCCCDDCCZZZZZZCCCDDCCCZZZOF",
  "FOZZZZCDDRRDCZZZZZZCDDRRDCZZZZOF",
  "FOZZZZZZCDDZZZCPPCZZZZDDCZZZZZOF",
  "FOZZZZZZCDDZZCWWLPCZZZDDCZZZZZOF",
  "FOZZZZZZCDDCWWLLLLWCCZDDCZZZZZOF",
  "FOZZZZZZCDDCWLLYYLLWCZDDCZZZZZOF",
  "FOZZZZZZCDDCWLYYYYLWCZDDCZZZZZOF",
  "FOZZZZZZCDDCWLLYYLLWCZDDCZZZZZOF",
  "FOZZZZZZCDDCWWLLLLWCCZDDCZZZZZOF",
  "FOZZZZZZCDDZZCWWLPCZZZDDCZZZZZOF",
  "FOZZZZZZCDDZZZCPPCZZZZDDCZZZZZOF",
  "FOZZZZZZCDDZZZZZZZZZZDDCZZZZZZOF",
  "FOZZZZZZCDDZZZZZZZZZZDDCZZZZZZOF",
  "FOZZZZZZCDDZZZZZZZZZZDDCZZZZZZOF",
  "FOZZZZZZCDDZZZZZZZZZZDDCZZZZZZOF",
  "FOZZZZZZCDDZZZZZZZZZZDDCZZZZZZOF",
  "FOZZZZZCDDDDCZZZZZZCDDDDCZZZZZOF",
  "FOZZZZZZCCCCZZZZZZZZCCCCZZZZZZOF",
  ".FOZZZZZZZZZZZZZZZZZZZZZZZZZZOF.",
  "..FOZZZZZZZZZZZZZZZZZZZZZZZZOF..",
  "...FOZZZZZZZZZZZZZZZZZZZZZZOF...",
  "....FFFFFFFFFFFFFFFFFFFFFFFF....",
  "................................"
];

// ICON 4: Refined 5-Petal Sakura Blossom (Pure, Vibrant, Perfectly Centered)
// A 5-petal Sakura flower has natural 5-fold symmetry:
// Top petal (12 o'clock)
// Top-right petal (~2:24)
// Bottom-right petal (~4:48)
// Bottom-left petal (~7:12)
// Top-left petal (~9:36)
// Let's create a beautiful geometric pixel art version with 5 notched petals!
const palPureSakura = {
  '.': null,
  '#': '#3a0511', // Deep cherry contour (crisp outline)
  'o': '#9f1239', // Shadow
  'x': '#e11d48', // Cherry pink
  '=': '#f43f5e', // Vibrant rose
  '-': '#fb7185', // Soft sakura
  '+': '#fbcfe8', // Pale blush
  '*': '#ffffff', // Petal tip highlight
  'Y': '#fef08a', // Center stamen bright
  'G': '#f59e0b', // Center stamen gold
  'O': '#b45309', // Center pistil core
};

const matrixPureSakura = [
  "................................",
  "............##....##............",
  "...........#++#..#++#...........",
  "..........#*--+#+--*#...........",
  "..........#*---++---*#..........",
  ".........#*---====---*#.........",
  ".........#*--=xxxx=--*#.........",
  "..........#--=xooox=--#.........",
  ".....##....#-==o##o==-#....##...",
  "...##++##...#-==##==-#...##++##.",
  "..#++--*#....#=oooo=#....#*--++#",
  ".#+---*#....#=xxxxxx=#....#*---+",
  ".#+--=o#..##=xoooooox=##..#o=--+",
  ".#--=xo#.#=xxo######oxxx=#.#ox=-",
  ".#--=xoo#=xo##YGGGGY##ox=#ooxx=-",
  "..#-=xooo=x#YGGGOOGGGY#x=ooox=-#",
  "..#-=xooo=x#YGGGOOGGGY#x=ooox=-#",
  ".#--=xoo#=xo##YGGGGY##ox=#ooxx=-",
  ".#--=xo#.#=xxo######oxxx=#.#ox=-",
  ".#+--=o#..##=xoooooox=##..#o=--+",
  ".#+---*#....#=xxxxxx=#....#*---+",
  "..#++--*#....#=oooo=#....#*--++#",
  "...##++##...#-==##==-#...##++##.",
  ".....##....#-==o##o==-#....##...",
  "..........#--=xooox=--#.........",
  ".........#*--=xxxx=--*#.........",
  ".........#*---====---*#.........",
  "..........#*---++---*#..........",
  "..........#*--+#+--*#...........",
  "...........#++#..#++#...........",
  "............##....##............",
  "................................"
];

// Write icons
fs.writeFileSync('c:/Gabut/Pixel_Sakura/public/favicon_blossom.svg', buildSvg(matrixBlossom, palBlossom));
fs.writeFileSync('c:/Gabut/Pixel_Sakura/public/favicon_torii.svg', buildSvg(matrixTorii, palTorii));
fs.writeFileSync('c:/Gabut/Pixel_Sakura/public/favicon_badge.svg', buildSvg(matrixBadge, palBadge));
fs.writeFileSync('c:/Gabut/Pixel_Sakura/public/favicon_sakura.svg', buildSvg(matrixPureSakura, palPureSakura));

// Create a preview HTML file
const previewHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Sakura Icons Preview</title>
  <style>
    body { background: #111319; color: #fff; font-family: sans-serif; padding: 30px; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .card { background: #1e2230; padding: 20px; border-radius: 8px; text-align: center; }
    .preview-box { display: flex; justify-content: center; gap: 15px; margin: 15px 0; align-items: center; }
    .bg-dark { background: #1a1a24; padding: 10px; border-radius: 4px; }
    .bg-light { background: #e5e7eb; padding: 10px; border-radius: 4px; }
    h3 { margin: 0 0 10px 0; font-size: 14px; color: #f472b6; }
    p { font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <h1>Pixel Sakura Favicon Candidates</h1>
  <div class="grid">
    <div class="card">
      <h3>1. Torii Gate + Falling Sakura</h3>
      <p>Iconic red shrine gate with blooming sakura</p>
      <div class="preview-box">
        <div class="bg-dark"><img src="/favicon_torii.svg" width="64" height="64" /></div>
        <div class="bg-light"><img src="/favicon_torii.svg" width="64" height="64" /></div>
      </div>
      <div class="preview-box">
        <span>16px: <img src="/favicon_torii.svg" width="16" height="16" /></span>
        <span>32px: <img src="/favicon_torii.svg" width="32" height="32" /></span>
      </div>
    </div>
    <div class="card">
      <h3>2. Sakura Shrine Badge</h3>
      <p>Retro framed cartridge emblem with gold border</p>
      <div class="preview-box">
        <div class="bg-dark"><img src="/favicon_badge.svg" width="64" height="64" /></div>
        <div class="bg-light"><img src="/favicon_badge.svg" width="64" height="64" /></div>
      </div>
      <div class="preview-box">
        <span>16px: <img src="/favicon_badge.svg" width="16" height="16" /></span>
        <span>32px: <img src="/favicon_badge.svg" width="32" height="32" /></span>
      </div>
    </div>
    <div class="card">
      <h3>3. Pure Sakura Blossom</h3>
      <p>Notched cherry blossom with gold core</p>
      <div class="preview-box">
        <div class="bg-dark"><img src="/favicon_sakura.svg" width="64" height="64" /></div>
        <div class="bg-light"><img src="/favicon_sakura.svg" width="64" height="64" /></div>
      </div>
      <div class="preview-box">
        <span>16px: <img src="/favicon_sakura.svg" width="16" height="16" /></span>
        <span>32px: <img src="/favicon_sakura.svg" width="32" height="32" /></span>
      </div>
    </div>
    <div class="card">
      <h3>4. Classic Bloom Blossom</h3>
      <p>Sprawling petals with deep cherry shadow</p>
      <div class="preview-box">
        <div class="bg-dark"><img src="/favicon_blossom.svg" width="64" height="64" /></div>
        <div class="bg-light"><img src="/favicon_blossom.svg" width="64" height="64" /></div>
      </div>
      <div class="preview-box">
        <span>16px: <img src="/favicon_blossom.svg" width="16" height="16" /></span>
        <span>32px: <img src="/favicon_blossom.svg" width="32" height="32" /></span>
      </div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync('c:/Gabut/Pixel_Sakura/public/preview.html', previewHtml);
console.log('Generated all icons and preview.html');
