-- Add template_key column to brands for V1.3 Dual Template System
ALTER TABLE public.brands
ADD COLUMN IF NOT EXISTS template_key text DEFAULT 'legal-professional';

-- Index for efficient lookups (minor — single-owner mode doesn't need it, good for multi-user future)
CREATE INDEX IF NOT EXISTS idx_brands_template_key ON public.brands(template_key);