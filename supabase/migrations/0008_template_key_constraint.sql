-- Harden template_key values for V1.3 Dual Template System.
-- Normalize existing invalid data before applying the database constraint.

UPDATE public.brands
SET template_key = 'legal-professional'
WHERE template_key IS NULL
   OR template_key NOT IN ('legal-professional', 'accounting-professional');

ALTER TABLE public.brands
DROP CONSTRAINT IF EXISTS brands_template_key_check;

ALTER TABLE public.brands
ADD CONSTRAINT brands_template_key_check
CHECK (template_key IN ('legal-professional', 'accounting-professional'));
