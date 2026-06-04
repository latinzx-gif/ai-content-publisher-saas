/**
 * Template Registry — V1.3 Dual Template System
 *
 * Supported keys:
 *   - legal-professional
 *   - accounting-professional
 *
 * Each theme defines color palette, fonts, layout offsets, and decoration
 * used by the Sharp SVG compositor in renderer.ts.
 */

export interface ThemeConfig {
  key: 'legal-professional' | 'accounting-professional'
  name: string
  labelTh: string
  locales: ('TH' | 'EN')[]
  colors: {
    brand: string
    title: string
    bodyBg: string
    bodyText: string
    ctaBg: string
    ctaText: string
    accent: string
    overlayStart: string
    overlayEnd: string
  }
  fonts: {
    brand: string
    title: string
    body: string
    cta: string
  }
  layout: {
    brandY: number
    titleY: number
    bodyBgY: number
    ctaButtonY: number
  }
  hasAccentBar: boolean
  accentSvg?: string
  ctas: {
    default: string
    educate: string
    checklist: string
    compliance: string
  }
}

const LEGAL_THEME: ThemeConfig = {
  key: 'legal-professional',
  name: 'Legal Professional',
  labelTh: 'กฎหมายวิชาชีพ',
  locales: ['TH', 'EN'],
  colors: {
    brand:      'rgba(212, 175, 55, 0.95)',    // gold
    title:      'rgba(255, 255, 255, 0.98)',
    bodyBg:     'rgba(10, 25, 55, 0.75)',       // deep navy
    bodyText:   'rgba(240, 240, 245, 0.95)',
    ctaBg:      'rgba(212, 175, 55, 0.9)',      // gold button
    ctaText:    '#0A1030',                        // near-black
    accent:     'rgba(212, 175, 55, 0.6)',       // gold accent
    overlayStart: 'rgba(10, 25, 55, 0)',
    overlayEnd:   'rgba(10, 25, 55, 0.65)',
  },
  fonts: {
    brand: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif",
    title: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif",
    body:  "'Segoe UI', Roboto, system-ui, -apple-system, sans-serif",
    cta:   "'Segoe UI', Roboto, system-ui, -apple-system, sans-serif",
  },
  layout: {
    brandY: 80,
    titleY: 200,
    bodyBgY: 420,
    ctaButtonY: -140,
  },
  hasAccentBar: true,
  accentSvg: `<rect x="72" y="145" width="6" height="38" rx="3" fill="rgba(212,175,55,0.7)" />`,
  ctas: {
    default:    'ปรึกษาทนายความ',
    educate:    'เรียนรู้เพิ่มเติม',
    checklist:  'ดาวน์โหลดเช็คลิสต์',
    compliance: 'ตรวจสอบ PDPA',
  },
}

const ACCOUNTING_THEME: ThemeConfig = {
  key: 'accounting-professional',
  name: 'Accounting Professional',
  labelTh: 'บัญชีวิชาชีพ',
  locales: ['TH', 'EN'],
  colors: {
    brand:      'rgba(76, 175, 80, 0.95)',       // forest green
    title:      'rgba(255, 255, 255, 0.98)',
    bodyBg:     'rgba(20, 55, 30, 0.75)',        // dark green
    bodyText:   'rgba(240, 248, 240, 0.95)',
    ctaBg:      'rgba(76, 175, 80, 0.9)',        // green button
    ctaText:    '#FFFFFF',
    accent:     'rgba(255, 235, 59, 0.5)',       // pale yellow accent
    overlayStart: 'rgba(20, 55, 30, 0)',
    overlayEnd:   'rgba(20, 55, 30, 0.65)',
  },
  fonts: {
    brand: "'Segoe UI', Roboto, system-ui, -apple-system, sans-serif",
    title: "'Segoe UI', Roboto, system-ui, -apple-system, sans-serif",
    body:  "'Segoe UI', Roboto, system-ui, -apple-system, sans-serif",
    cta:   "'Segoe UI', Roboto, system-ui, -apple-system, sans-serif",
  },
  layout: {
    brandY: 80,
    titleY: 200,
    bodyBgY: 420,
    ctaButtonY: -140,
  },
  hasAccentBar: true,
  accentSvg: `<rect x="72" y="145" width="6" height="38" rx="3" fill="rgba(255,235,59,0.6)" />`,
  ctas: {
    default:    'ปรึกษาผู้สอบบัญชี',
    educate:    'เรียนรู้เพิ่มเติม',
    checklist:  'ดาวน์โหลดเช็คลิสต์',
    compliance: 'ตรวจสอบบัญชี',
  },
}

export const TEMPLATE_REGISTRY: Record<string, ThemeConfig> = {
  'legal-professional': LEGAL_THEME,
  'accounting-professional': ACCOUNTING_THEME,
}

export function getTemplateKeys(): string[] {
  return Object.keys(TEMPLATE_REGISTRY)
}

export function getDefaultTemplateKey(): string {
  return 'legal-professional'
}