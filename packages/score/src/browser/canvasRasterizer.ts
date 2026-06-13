// Browser-only: rasterize a glyph to a normalized coverage bitmap using canvas.
// Pass this as `ctx.rasterize` to enable the disambiguation metric.

import type { GlyphRasterizer, Bitmap, OpenTypeFont } from '../types.js';

type RasterCanvas = HTMLCanvasElement | OffscreenCanvas;
type RasterContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

function makeCanvas(size: number): { canvas: RasterCanvas; ctx: RasterContext } | null {
  let canvas: RasterCanvas;
  if (typeof OffscreenCanvas !== 'undefined') {
    canvas = new OffscreenCanvas(size, size);
  } else if (typeof document !== 'undefined') {
    canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
  } else {
    return null;
  }
  const ctx = canvas.getContext('2d') as RasterContext | null;
  return ctx ? { canvas, ctx } : null;
}

function bitmapFromCanvas(ctx: RasterContext, size: number): Bitmap {
  const img = ctx.getImageData(0, 0, size, size);
  const data = new Float32Array(size * size);
  for (let i = 0; i < data.length; i++) {
    data[i] = img.data[i * 4 + 3] / 255; // alpha channel = coverage
  }
  return { size, data };
}

function rasterizeSingleGlyph(
  font: OpenTypeFont,
  char: string,
  size: number,
): Bitmap | null {
  const glyph = font.charToGlyph(char);
  if (!glyph || glyph.unicode == null) return null;

  let bb;
  try {
    bb = glyph.getBoundingBox();
  } catch {
    return null;
  }
  const gw = bb.x2 - bb.x1;
  const gh = bb.y2 - bb.y1;
  if (gw <= 0 || gh <= 0) return null;

  const pad = size * 0.1;
  const avail = size - 2 * pad;
  const scaleFactor = avail / Math.max(gw, gh);
  const fontSize = scaleFactor * font.unitsPerEm;

  // opentype getPath(x, y, fontSize): glyph coords scale by fontSize/unitsPerEm,
  // y is the baseline and grows downward on canvas.
  const x = pad - bb.x1 * scaleFactor + (avail - gw * scaleFactor) / 2;
  const y = pad + bb.y2 * scaleFactor + (avail - gh * scaleFactor) / 2;

  const made = makeCanvas(size);
  if (!made) return null;
  const { ctx } = made;
  ctx.clearRect(0, 0, size, size);
  const path = glyph.getPath(x, y, fontSize);
  path.fill = '#000';
  path.draw(ctx);

  return bitmapFromCanvas(ctx, size);
}

function makeCanvasWH(w: number, h: number): { canvas: RasterCanvas; ctx: RasterContext } | null {
  let canvas: RasterCanvas;
  if (typeof OffscreenCanvas !== 'undefined') {
    canvas = new OffscreenCanvas(w, h);
  } else if (typeof document !== 'undefined') {
    canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
  } else {
    return null;
  }
  const ctx = canvas.getContext('2d') as RasterContext | null;
  return ctx ? { canvas, ctx } : null;
}

function rasterizeString(
  font: OpenTypeFont,
  str: string,
  size: number,
): Bitmap | null {
  // Scale so cap height fills the available height, matching single-glyph normalization.
  const os2 = font.tables?.os2;
  const capH: number = os2?.sCapHeight > 0 ? os2.sCapHeight : 0;
  if (!capH) return null;

  const pad = size * 0.1;
  const avail = size - 2 * pad;
  const scaleFactor = avail / capH;
  const fontSize = scaleFactor * font.unitsPerEm;

  const strWidth = font.getAdvanceWidth(str, fontSize);
  if (strWidth <= 0) return null;

  // Render at natural width, then scale down to size×size for a fair comparison.
  const renderW = Math.ceil(strWidth + 2 * pad);
  const src = makeCanvasWH(renderW, size);
  if (!src) return null;
  const path = font.getPath(str, pad, pad + capH * scaleFactor, fontSize);
  path.fill = '#000';
  path.draw(src.ctx);

  const out = makeCanvas(size);
  if (!out) return null;
  out.ctx.drawImage(src.canvas as CanvasImageSource, 0, 0, renderW, size, 0, 0, size, size);
  return bitmapFromCanvas(out.ctx, size);
}

export const canvasRasterizer: GlyphRasterizer = (
  font: OpenTypeFont,
  str: string,
  size = 64,
): Bitmap | null => {
  if (str.length === 1) return rasterizeSingleGlyph(font, str, size);
  return rasterizeString(font, str, size);
};
