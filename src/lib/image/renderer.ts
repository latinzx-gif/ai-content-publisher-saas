/**
 * Text Overlay Renderer — composits title, body, CTA, and brand name
 * onto an AI-generated background image using Sharp + SVG.
 *
 * The AI model generates background/illustration ONLY — all body text
 * is rendered programmatically via SVG to ensure readability.
 *
 * V1.3: Accepts a ThemeConfig for dual-template system.
 */

import sharp from 'sharp'
import { ThemeConfig } from '@/config/templates'

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
  textCharsOverlaid: number
  themeKey: string
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
 * Build an SVG text overlay using the given theme.
 *
 * Layout (1536×1024 reference):
 * ┌─────────────────────────────────────┐
 * │   [accent bar] Brand Name            │  theme.layout.brandY
 * │                                     │
 * │   Title (large, theme font)         │  theme.layout.titleY
 * │                                     │
 * │   Body text (theme bg + text)       │  theme.layout.bodyBgY
 * │                                     │
 * │   [ CTA Button (theme colors) ]      │  bottom area
 * │                                     │
 * └─────────────────────────────────────┘
 */
function buildSvg(width: number, height: number, input: TextOverlayInput, theme: ThemeConfig): string {
  const title = escapeXml(truncate(input.title, 120))
  const body = escapeXml(truncate(input.body, 300))
  const cta = escapeXml(truncate(input.cta, 60))
  const brand = escapeXml(truncate(input.brandName, 60))

  const ly = theme.layout

  const overlayGradient = `
    <linearGradient id="overlay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${theme.colors.overlayStart}" />
      <stop offset="60%" stop-color="${theme.colors.overlayEnd}" />
      <stop offset="100%" stop-color="${theme.colors.overlayEnd}" />
    </linearGradient>`

  const accentBar = theme.hasAccentBar && theme.accentSvg
    ? theme.accentSvg
    : ''

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    ${overlayGradient}
  </defs>

  <!-- Bottom gradient overlay for text readability -->
  <rect x="0" y="${Math.round(height * 0.5)}" width="${width}" height="${Math.round(height * 0.5)}" fill="url(#overlay)" />

  ${accentBar}

  <!-- Brand name (top-left, theme color + font) -->
  <text x="96" y="${ly.brandY}" font-family="${theme.fonts.brand}"
        font-size="28" font-weight="600" fill="${theme.colors.brand}" letter-spacing="1.5">
    ${brand}
  </text>

  <!-- Title (large, prominent) -->
  <text x="96" y="${ly.titleY}" font-family="${theme.fonts.title}"
        font-size="52" font-weight="700" fill="${theme.colors.title}" letter-spacing="-0.3">
    <tspan x="96" dy="0">${title.split('\n')[0]}</tspan>
    ${title.includes('\n') ? `<tspan x="96" dy="64">${title.split('\n')[1] || ''}</tspan>` : ''}
  </text>

  <!-- Body text background -->
  <rect x="86" y="${ly.bodyBgY}" width="${Math.round(width * 0.86)}" height="300" rx="14" fill="${theme.colors.bodyBg}" />

  <!-- Body text -->
  <text x="110" y="${ly.bodyBgY + 56}" font-family="${theme.fonts.body}"
        font-size="30" font-weight="400" fill="${theme.colors.bodyText}" line-height="1.45">
    ${wrapText(body, 30, Math.round(width * 0.78)).map((line, i) =>
      `<tspan x="110" dy="${i === 0 ? 0 : 44}">${line}</tspan>`
    ).join('')}
  </text>

  <!-- CTA button -->
  <rect x="86" y="${height + ly.ctaButtonY}" width="340" height="60" rx="30" fill="${theme.colors.ctaBg}" />
  <text x="256" y="${height + ly.ctaButtonY + 36}" font-family="${theme.fonts.cta}"
        font-size="26" font-weight="700" fill="${theme.colors.ctaText}" text-anchor="middle" letter-spacing="1">
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
    if (lines.length >= 6) break
  }
  if (currentLine && lines.length < 6) lines.push(currentLine)

  return lines
}

/**
 * Render text overlay onto a background image using a theme.
 */
export async function renderTextOverlay(
  backgroundBuffer: Buffer,
  width: number,
  height: number,
  input: TextOverlayInput,
  theme: ThemeConfig
): Promise<RenderResult> {
  const svg = buildSvg(width, height, input, theme)

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
    textCharsOverlaid: textChars,
    themeKey: theme.key,
  }
}

/**
 * QA gate: validate text overlay integrity.
 * Rejects if title/body missing, text_chars < 30, buffer < 5000 bytes, or size mismatch.
 */
export function qaCheckTextRendered(
  result: RenderResult,
  input: QaInput
): QaResult {
  const titleTrimmed = (input.title || '').trim()
  if (!titleTrimmed) return { pass: false, reason: 'title_missing' }

  const bodyTrimmed = (input.body || '').trim()
  if (!bodyTrimmed) return { pass: false, reason: 'body_missing' }

  if (result.textCharsOverlaid < 30) {
    return { pass: false, reason: `text_chars_too_low: ${result.textCharsOverlaid} (minimum 30)` }
  }

  if (result.buffer.length < 5000) {
    return { pass: false, reason: `buffer_too_small: ${result.buffer.length} bytes (minimum 5000)` }
  }

  if (result.width !== input.platformWidth || result.height !== input.platformHeight) {
    return { pass: false, reason: `size_mismatch: got ${result.width}x${result.height}, expected ${input.platformWidth}x${input.platformHeight}` }
  }

  return { pass: true }
}

export { resolveCta } from './template-resolver'