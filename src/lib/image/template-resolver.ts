/**
 * Template Resolver — maps a brand's template_key to a ThemeConfig.
 *
 * Brand → Template Resolver → Renderer
 */
import { TEMPLATE_REGISTRY, getDefaultTemplateKey, ThemeConfig } from '@/config/templates'

export interface BrandTemplateData {
  templateKey: string
  name: string
  targetAudience: string
  tone: string
  personality: string
}

/**
 * Resolve the theme for a given brand's template_key.
 * Falls back to legal-professional if key is missing or unrecognized.
 */
export function resolveTheme(brand: BrandTemplateData): ThemeConfig {
  const key = brand.templateKey || getDefaultTemplateKey()
  return TEMPLATE_REGISTRY[key] || TEMPLATE_REGISTRY[getDefaultTemplateKey()]
}

/**
 * Extract a CTA from metadata using the theme's CTA presets.
 */
export function resolveCta(
  metadata: { format?: string; objective?: string; caption?: string },
  theme: ThemeConfig
): string {
  const format = (metadata.format || '').toLowerCase()
  const objective = (metadata.objective || '').toLowerCase()

  if (format.includes('educate') || objective.includes('educate')) return theme.ctas.educate
  if (format.includes('checklist') || objective.includes('checklist')) return theme.ctas.checklist
  if (format.includes('compliance') || objective.includes('compliance')) return theme.ctas.compliance

  return theme.ctas.default
}