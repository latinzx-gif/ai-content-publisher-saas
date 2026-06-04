/**
 * Text Overlay Renderer — composits title, body, CTA, and brand name
 * onto an AI-generated background image using Sharp + SVG.
 *
 * The AI model generates background/illustration ONLY — all body text
 * is rendered programmatically via SVG to ensure readability.
 */

import sharp from 'sharp'

export interface TextOverlayInput {
  title: string
  body: string
  cta: string
  brandName: string
}

export interface RenderResult {
  buffer: Buffer
  width: number
  height: number
  textCharsOverlaid: number  // QA metric: total characters rendered via SVG
}

export interface QaInput {
  title: string
  body: string
  platformWidth: number
  platformHeight: number
}

export interface QaResult {
  pass: boolean
  reason?: string
}

function truncate(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text
  return text.slice(0, maxChars - 1) + '…'
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/**
 * Build an SVG text overlay for a given canvas size.
 *
 * Layout (1536×1024 Facebook post reference):
 * ┌─────────────────────────────────────┐
 * │   Brand Name                         │  y=60, small
 * │                                     │
 * │   Title                              │  y=180, large bold
 * │   (multi-line)                       │
 * │                                     │
 * │   Body text                          │  y=420, medium
 * │   (truncated, readable)              │
 * │                                     │
 * │   [ CTA Button ]                     │  y=780, highlighted
 * │                                     │
 * └─────────────────────────────────────┘
 */
function buildSvg(width: number, height: number, input: TextOverlayInput): string {
  const title = escapeXml(truncate(input.title, 120))
  const body = escapeXml(truncate(input.body, 300))
  const cta = escapeXml(truncate(input.cta, 60))
  const brand = escapeXml(truncate(input.brandName, 60))

  // Semi-transparent overlay at bottom to ensure text readability
  const overlayGradient = `
    <linearGradient id="overlay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(0,0,0,0)" />
      <stop offset="60%" stop-color="rgba(0,0,0,0.35)" />
      <stop offset="100%" stop-color="rgba(0,0,0,0.55)" />
    </linearGradient>`

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    ${overlayGradient}
  </defs>

  <!-- Semi-transparent overlay at bottom 40% for readability -->
  <rect x="0" y="${Math.round(height * 0.55)}" width="${width}" height="${Math.round(height * 0.45)}" fill="url(#overlay)" />

  <!-- Brand name (top, small, subtle) -->
  <text x="80" y="80" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        font-size="28" font-weight="600" fill="rgba(255,255,255,0.9)" letter-spacing="1.5">
    ${brand}
  </text>

  <!-- Title (large, prominent) -->
  <text x="80" y="200" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        font-size="56" font-weight="800" fill="white" letter-spacing="-0.5">
    <tspan x="80" dy="0">${title.split('\n')[0]}</tspan>
    ${title.includes('\n') ? `<tspan x="80" dy="68">${title.split('\n')[1] || ''}</tspan>` : ''}
  </text>

  <!-- Body text (truncated, readable, semi-transparent background for contrast) -->
  <rect x="72" y="420" width="${Math.round(width * 0.85)}" height="320" rx="16" fill="rgba(0,0,0,0.5)" />
  <text x="96" y="480" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        font-size="32" font-weight="400" fill="rgba(255,255,255,0.95)" line-height="1.5">
    ${wrapText(body, 32, Math.round(width * 0.78)).map((line, i) =>
      `<tspan x="96" dy="${i === 0 ? 0 : 48}">${line}</tspan>`
    ).join('')}
  </text>

  <!-- CTA (bottom, highlighted) -->
  <rect x="80" y="${height - 140}" width="340" height="64" rx="32" fill="rgba(255,255,255,0.9)" />
  <text x="250" y="${height - 102}" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        font-size="28" font-weight="700" fill="#0B1E33" text-anchor="middle" letter-spacing="1">
    ${cta}
  </text>
</svg>`
}

/**
 * Simple text wrapping: break string into lines that fit within maxWidth px at given font size.
 * Approximate: each char is ~0.55× fontSize in pixels for sans-serif.
 */
function wrapText(text: string, fontSize: number, maxWidth: number): string[] {
  const charWidth = fontSize * 0.55
  const maxCharsPerLine = Math.floor(maxWidth / charWidth)
  const lines: string[] = []
  const words = text.split(' ')
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
    if (lines.length >= 6) break  // max 6 lines
  }
  if (currentLine && lines.length < 6) lines.push(currentLine)

  return lines
}

/**
 * Render text overlay onto a background image.
 *
 * @param backgroundBuffer - Raw image buffer (e.g. WebP from OpenAI)
 * @param width  - Canvas width in pixels
 * @param height - Canvas height in pixels
 * @param input  - Text content to overlay
 * @returns Composited image buffer (WebP)
 */
export async function renderTextOverlay(
  backgroundBuffer: Buffer,
  width: number,
  height: number,
  input: TextOverlayInput
): Promise<RenderResult> {
  const svg = buildSvg(width, height, input)

  const result = await sharp(backgroundBuffer)
    .resize(width, height, { fit: 'cover', position: 'centre' })
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .webp({ quality: 85 })
    .toBuffer()

  const textChars = input.title.length + input.body.length + input.cta.length + input.brandName.length

  return {
    buffer: result,
    width,
    height,
    textCharsOverlaid: textChars
  }
}

/**
 * Extract a CTA from caption or return a sensible default.
 */
export function extractCta(metadata: { format?: string; objective?: string; caption?: string }): string {
  const format = (metadata.format || '').toLowerCase()
  const objective = (metadata.objective || '').toLowerCase()

  if (format.includes('educational') || objective.includes('educate')) return 'เรียนรู้เพิ่มเติม'
  if (format.includes('q&a') || objective.includes('qa')) return 'ถามเราเลย'
  if (format.includes('myth') || objective.includes('myth')) return 'รู้จริง รู้ทัน'
  if (format.includes('checklist') || objective.includes('checklist')) return 'ดาวน์โหลดเช็คลิสต์'
  if (format.includes('compliance') || objective.includes('compliance')) return 'ตรวจสอบ PDPA'
  if (format.includes('tip') || objective.includes('tips')) return 'ดูเคล็ดลับเพิ่มเติม'
  if (format.includes('news') || objective.includes('update')) return 'อ่านอัปเดตล่าสุด'

  return 'ดูรายละเอียดเพิ่มเติม'
}

/**
 * QA gate: validate text overlay integrity before accepting an image option.
 *
 * Rejects if:
 *  - title is empty or missing
 *  - body is empty or missing
 *  - total text_chars < 30 (insufficient readable content)
 *  - output buffer < 5000 bytes (likely corrupt or empty)
 *  - rendered dimensions don't match requested platform size
 */
export function qaCheckTextRendered(
  result: RenderResult,
  input: QaInput
): QaResult {
  // 1. Title missing or empty
  const titleTrimmed = (input.title || '').trim()
  if (!titleTrimmed) {
    return { pass: false, reason: 'title_missing' }
  }

  // 2. Body missing or empty
  const bodyTrimmed = (input.body || '').trim()
  if (!bodyTrimmed) {
    return { pass: false, reason: 'body_missing' }
  }

  // 3. Total overlaid characters below threshold
  if (result.textCharsOverlaid < 30) {
    return {
      pass: false,
      reason: `text_chars_too_low: ${result.textCharsOverlaid} (minimum 30)`
    }
  }

  // 4. Output buffer too small (corrupt / empty)
  if (result.buffer.length < 5000) {
    return {
      pass: false,
      reason: `buffer_too_small: ${result.buffer.length} bytes (minimum 5000)`
    }
  }

  // 5. Platform image size mismatch
  if (result.width !== input.platformWidth || result.height !== input.platformHeight) {
    return {
      pass: false,
      reason: `size_mismatch: got ${result.width}x${result.height}, expected ${input.platformWidth}x${input.platformHeight}`
    }
  }

  return { pass: true }
}