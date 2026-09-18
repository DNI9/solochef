import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// CRC32 implementation
const crcTable = (() => {
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  buf.writeUInt32BE(crc32(typeAndData), 8 + len);
  return buf;
}

function createPng(width, height, renderPixel) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = renderPixel(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }
  const idatChunk = makeChunk('IDAT', zlib.deflateSync(rawData, { level: 9 }));
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Distance to rounded rectangle
function sdRoundBox(px, py, bx, by, bw, bh, r) {
  const cx = bx + bw / 2;
  const cy = by + bh / 2;
  const qx = Math.abs(px - cx) - (bw / 2 - r);
  const qy = Math.abs(py - cy) - (bh / 2 - r);
  const outerDist = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  const innerDist = Math.min(Math.max(qx, qy), 0);
  return (outerDist + innerDist) - r;
}

function renderDabbaIcon(x, y, w, h, isMaskable = false) {
  // Normalize coordinates to 0..512 space
  const scale = 512 / w;
  let px = x * scale;
  let py = y * scale;

  // Background gradient: Saffron #ea580c (234, 88, 12) -> Warm Tangerine #f97316 (249, 115, 22)
  const bgT = (px + py) / 1024;
  const bgR = Math.round(234 + (251 - 234) * bgT);
  const bgG = Math.round(88 + (146 - 88) * bgT);
  const bgB = Math.round(12 + (60 - 12) * bgT);

  // If not maskable, round corners with squircle radius 112
  if (!isMaskable) {
    const dCorner = sdRoundBox(px, py, 0, 0, 512, 512, 112);
    if (dCorner > 0) {
      // Outside squircle: transparent
      return [0, 0, 0, 0];
    }
  }

  // Base background pixel
  let color = [bgR, bgG, bgB, 255];

  // For maskable icon, slightly inset the content (scale 0.8 around center)
  if (isMaskable) {
    px = 256 + (px - 256) / 0.8;
    py = 256 + (py - 256) / 0.8;
  }

  // Dabba Outer Body: x=96, y=112, w=320, h=304, r=44
  const dBody = sdRoundBox(px, py, 96, 112, 320, 304, 44);
  const dHandle = sdRoundBox(px, py, 206, 94, 100, 24, 12);
  const dLeftLatch = sdRoundBox(px, py, 84, 240, 14, 48, 6);
  const dRightLatch = sdRoundBox(px, py, 414, 240, 14, 48, 6);

  // Latches / metallic accents
  if (dLeftLatch <= 0 || dRightLatch <= 0 || dHandle <= 0) {
    color = [228, 228, 231, 255]; // Metal slate #e4e4e7
    return color;
  }

  // Outer Dabba shell
  if (dBody <= 0) {
    if (dBody > -6) {
      // Outer border stroke
      return [228, 228, 231, 255];
    }
    // Dabba white interior bed
    color = [244, 244, 245, 255];

    // Bento Compartment 1: Left (x=120, y=136, w=128, h=256, r=26) -> Golden rice/grain
    const dComp1 = sdRoundBox(px, py, 120, 136, 128, 256, 26);
    if (dComp1 <= 0) {
      // Grain gradient #fef08a to #f59e0b
      const gt = (py - 136) / 256;
      const gr = Math.round(254 + (245 - 254) * gt);
      const gg = Math.round(240 + (158 - 240) * gt);
      const gb = Math.round(138 + (11 - 138) * gt);
      
      // Center steam mound
      const distMound = Math.hypot(px - 184, py - 276);
      if (distMound < 38) {
        return [254, 240, 138, 255];
      }
      return [gr, gg, gb, 255];
    }

    // Bento Compartment 2: Top Right (x=264, y=136, w=128, h=120, r=26) -> Crisp Greens
    const dComp2 = sdRoundBox(px, py, 264, 136, 128, 120, 26);
    if (dComp2 <= 0) {
      // Greens gradient #4ade80 to #15803d
      const ggt = (py - 136) / 120;
      const gr = Math.round(74 + (21 - 74) * ggt);
      const gg = Math.round(222 + (128 - 222) * ggt);
      const gb = Math.round(128 + (61 - 128) * ggt);

      // Veggie slice highlight
      const dLeaf = Math.hypot(px - 328, py - 196);
      if (dLeaf < 28) {
        return [134, 239, 172, 255];
      }
      return [gr, gg, gb, 255];
    }

    // Bento Compartment 3: Bottom Right (x=264, y=272, w=128, h=120, r=26) -> Savory Curry / Protein
    const dComp3 = sdRoundBox(px, py, 264, 272, 128, 120, 26);
    if (dComp3 <= 0) {
      // Curry gradient #fb923c to #c2410c
      const ct = (py - 272) / 120;
      const cr = Math.round(251 + (194 - 251) * ct);
      const cg = Math.round(146 + (65 - 146) * ct);
      const cb = Math.round(60 + (12 - 60) * ct);

      const dCurryCenter = Math.hypot(px - 328, py - 332);
      if (dCurryCenter < 24) {
        return [254, 215, 170, 255]; // Garnish center
      }
      return [cr, cg, cb, 255];
    }
  }

  return color;
}

const iconsDir = path.join(rootDir, 'public', 'icons');
fs.mkdirSync(iconsDir, { recursive: true });

console.log('Generating PWA icons...');

// 1. icon-192.png
const buf192 = createPng(192, 192, (x, y, w, h) => renderDabbaIcon(x, y, w, h, false));
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), buf192);
console.log('Created icon-192.png');

// 2. icon-512.png
const buf512 = createPng(512, 512, (x, y, w, h) => renderDabbaIcon(x, y, w, h, false));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), buf512);
console.log('Created icon-512.png');

// 3. icon-maskable-192.png
const bufMask192 = createPng(192, 192, (x, y, w, h) => renderDabbaIcon(x, y, w, h, true));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-192.png'), bufMask192);
console.log('Created icon-maskable-192.png');

// 4. icon-maskable-512.png
const bufMask512 = createPng(512, 512, (x, y, w, h) => renderDabbaIcon(x, y, w, h, true));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512.png'), bufMask512);
console.log('Created icon-maskable-512.png');

// 5. apple-touch-icon.png (180x180)
const bufApple = createPng(180, 180, (x, y, w, h) => renderDabbaIcon(x, y, w, h, false));
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), bufApple);
console.log('Created apple-touch-icon.png');

// 6. favicon.png (48x48) & favicon.ico (ICO containing 48x48 PNG)
const bufFavicon = createPng(48, 48, (x, y, w, h) => renderDabbaIcon(x, y, w, h, false));
fs.writeFileSync(path.join(iconsDir, 'favicon-48.png'), bufFavicon);

// Standard Windows ICO format wrapping the 48x48 PNG
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0); // reserved
icoHeader.writeUInt16LE(1, 2); // icon type
icoHeader.writeUInt16LE(1, 4); // 1 image

const icoEntry = Buffer.alloc(16);
icoEntry[0] = 48; // width
icoEntry[1] = 48; // height
icoEntry[2] = 0;  // palette colors
icoEntry[3] = 0;  // reserved
icoEntry.writeUInt16LE(1, 4); // color planes
icoEntry.writeUInt16LE(32, 6); // bpp
icoEntry.writeUInt32LE(bufFavicon.length, 8); // image size
icoEntry.writeUInt32LE(22, 12); // image offset (6 header + 16 entry = 22)

const icoBuf = Buffer.concat([icoHeader, icoEntry, bufFavicon]);
fs.writeFileSync(path.join(rootDir, 'src', 'app', 'favicon.ico'), icoBuf);
console.log('Updated src/app/favicon.ico with new Dabba icon');

console.log('All icons generated successfully!');
