import { readFile } from 'node:fs/promises';
import path from 'node:path';

export interface Dimensions {
  width: number;
  height: number;
}

// Read the intrinsic pixel size of a preview image at build time, so the page
// can emit explicit width/height (Lighthouse "image elements have explicit
// dimensions"). Dependency-free on purpose — we only ship PNG/JPEG previews, so
// a tiny header parse beats pulling in sharp/image-size. Paths are /public-
// relative, matching projects.yaml (e.g. "/projects/tlaloc.jpg"). Returns
// undefined for a missing file or unsupported format; callers then omit the
// attributes rather than guessing.
export async function imageSize(publicPath: string): Promise<Dimensions | undefined> {
  try {
    const file = path.join(process.cwd(), 'public', publicPath.replace(/^\//, ''));
    const buf = await readFile(file);
    return png(buf) ?? jpeg(buf);
  } catch {
    return undefined;
  }
}

// PNG: 8-byte signature, then the IHDR chunk carries width/height as big-endian
// uint32 at fixed offsets 16 and 20.
function png(buf: Buffer): Dimensions | undefined {
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return undefined;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

// JPEG: walk the marker segments from after the SOI (FF D8). The frame size
// lives in a Start-Of-Frame marker (SOF0–SOF15 = 0xC0–0xCF), excluding the
// non-SOF markers in that range: DHT (C4), JPG (C8), DAC (CC).
function jpeg(buf: Buffer): Dimensions | undefined {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return undefined;
  let o = 2;
  while (o + 9 < buf.length) {
    if (buf[o] !== 0xff) {
      o++;
      continue;
    }
    const marker = buf[o + 1];
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buf.readUInt16BE(o + 5), width: buf.readUInt16BE(o + 7) };
    }
    o += 2 + buf.readUInt16BE(o + 2); // jump to the next segment
  }
  return undefined;
}
