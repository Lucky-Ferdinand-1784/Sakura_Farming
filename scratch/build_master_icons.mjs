import fs from 'fs';

// Palette for the Torii Gate & Sakura Blossom Masterpiece
const P = {
  '.': null,
  'K': '#090d16', // Obsidian black lacquer
  'G': '#f59e0b', // Imperial Gold finial
  'Y': '#fef08a', // Bright gold pollen
  'O': '#d97706', // Deep amber stamen core
  'R': '#ef4444', // Vermilion torii gate
  'D': '#b91c1c', // Torii deep crimson
  'S': '#7f1d1d', // Torii dark shadow
  'B': '#1e293b', // Granite stone base dark
  'A': '#475569', // Granite stone base light
  'H': '#2b040c', // Dark cherry contour / outline
  'P': '#fb7185', // Sakura petal rose
  'Q': '#f43f5e', // Sakura petal vibrant
  'L': '#fbcfe8', // Sakura petal soft blush
  'W': '#ffffff', // Sakura petal glistening white highlight
  'C': '#9f1239', // Petal shadow
};

// 32x32 Master Grid
const matrix = [
  "................................",
  "....GG....................GG....",
  "...GKKKKKKKKKKKKKKKKKKKKKKKKG...",
  "...HKRRRRRRRRRRRRRRRRRRRRRRKH...",
  "....HSSSSSSSSSSSSSSSSSSSSSSH....",
  ".......HSSSSSSSSSSSSSSSSSH......",
  "......HSRRRRRRRRRRRRRRRRSH......",
  "......HSKK............KKSH......",
  "....GGHSDDGG........GGHSDDGG....",
  "...GKRRRRRRKG......GKRRRRRRKG...",
  "...HSDDDDDDDH......HSDDDDDDDH...",
  "......HSDD............DDSH......",
  "......HSDD...HLLLLLH..DDSH......",
  "......HSDD..HLWWWWLLH.DDSH......",
  "......HSDD.HLWPQQPWLH.DDSH......",
  "......HSDD.HLPQYYQPLH.DDSH......",
  "......HSDD.HLPQYYQPLH.DDSH......",
  "..HLL.HSDD.HLWPQQPWLH.DDSH......",
  ".HLWLHHSDD..HLWWWWLLH.DDSH......",
  ".HLQPLHSDD...HLLLLLH..DDSH......",
  "..HLH.HSDD............DDSH......",
  "......HSDD............DDSH......",
  "......HSDD............DDSH..HLL.",
  "......HSDD............DDSH.HLWLH",
  "......HSDD............DDSH.HLPLH",
  "......HSDD............DDSH..HLH.",
  "......HSDD............DDSH......",
  ".....HBAABH..........HBAABH.....",
  ".....HBBBBA..........HBBBBA.....",
  "......HHHH............HHHH......",
  "................................",
  "................................"
];

// 1. Build SVG
function buildSvg(mat, pal, size = 32) {
  let rects = [];
  for (let y = 0; y < mat.length; y++) {
    const row = mat[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      const col = pal[ch];
      if (col) {
        rects.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${col}" />`);
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%" shape-rendering="crispEdges">
  <title>Sakura Pixel Farm Sanctuary</title>
  ${rects.join('\n  ')}
</svg>`;
}

// 2. Build standard ICO file (32x32 32-bit RGBA BMP inside ICO container)
function buildIco(mat, pal) {
  const width = 32;
  const height = 32;
  const bpp = 32;
  const pixelBytes = width * height * 4;
  const maskBytes = (width * height) / 8; // 128 bytes
  const headerSize = 40; // BITMAPINFOHEADER
  const imageSize = headerSize + pixelBytes + maskBytes;
  const totalFileSize = 6 + 16 + imageSize;

  const buf = Buffer.alloc(totalFileSize);

  // ICONDIR
  buf.writeUInt16LE(0, 0); // reserved
  buf.writeUInt16LE(1, 2); // 1 = ICO
  buf.writeUInt16LE(1, 4); // 1 image

  // ICONDIRENTRY
  buf.writeUInt8(width, 6);
  buf.writeUInt8(height, 7);
  buf.writeUInt8(0, 8); // color count (0 if >= 8bpp)
  buf.writeUInt8(0, 9); // reserved
  buf.writeUInt16LE(1, 10); // color planes
  buf.writeUInt16LE(bpp, 12); // bits per pixel
  buf.writeUInt32LE(imageSize, 14); // image size in bytes
  buf.writeUInt32LE(22, 18); // offset to image data

  // BITMAPINFOHEADER at offset 22
  let offset = 22;
  buf.writeUInt32LE(40, offset); // biSize
  buf.writeInt32LE(width, offset + 4); // biWidth
  buf.writeInt32LE(height * 2, offset + 8); // biHeight (double for ICO)
  buf.writeUInt16LE(1, offset + 12); // biPlanes
  buf.writeUInt16LE(bpp, offset + 14); // biBitCount
  buf.writeUInt32LE(0, offset + 16); // biCompression = BI_RGB
  buf.writeUInt32LE(pixelBytes + maskBytes, offset + 20); // biSizeImage
  buf.writeInt32LE(0, offset + 24); // biXPelsPerMeter
  buf.writeInt32LE(0, offset + 28); // biYPelsPerMeter
  buf.writeUInt32LE(0, offset + 32); // biClrUsed
  buf.writeUInt32LE(0, offset + 36); // biClrImportant

  offset += 40;

  // Pixel array (bottom-up: row 31 to 0, left to right: col 0 to 31)
  // Each pixel is 4 bytes: B, G, R, A
  for (let y = height - 1; y >= 0; y--) {
    const row = mat[y];
    for (let x = 0; x < width; x++) {
      const ch = row[x];
      const col = pal[ch];
      if (col) {
        // Hex to RGBA
        const hex = col.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        buf.writeUInt8(b, offset++);
        buf.writeUInt8(g, offset++);
        buf.writeUInt8(r, offset++);
        buf.writeUInt8(255, offset++); // Alpha
      } else {
        buf.writeUInt8(0, offset++);
        buf.writeUInt8(0, offset++);
        buf.writeUInt8(0, offset++);
        buf.writeUInt8(0, offset++); // Transparent
      }
    }
  }

  // AND mask (all 0s because alpha channel handles transparency)
  for (let i = 0; i < maskBytes; i++) {
    buf.writeUInt8(0, offset++);
  }

  return buf;
}

// Generate files
const svgContent = buildSvg(matrix, P);
const icoBuffer = buildIco(matrix, P);

fs.writeFileSync('c:/Gabut/Pixel_Sakura/public/favicon.svg', svgContent);
fs.writeFileSync('c:/Gabut/Pixel_Sakura/public/favicon.ico', icoBuffer);

console.log('Successfully generated public/favicon.svg and public/favicon.ico!');
