-- Brand Memory MVP
-- Extends the existing single-owner brand profile with lightweight memory fields.

alter table public.brands
  add column if not exists brand_description text,
  add column if not exists brand_instructions text,
  add column if not exists content_rules text,
  add column if not exists image_rules text,
  add column if not exists reference_images jsonb not null default '[]'::jsonb;

comment on column public.brands.brand_description is 'MVP brand memory: concise brand identity and positioning.';
comment on column public.brands.brand_instructions is 'MVP brand memory: standing content instructions for AI generation.';
comment on column public.brands.content_rules is 'MVP brand memory: writing rules, required language, claims, and compliance constraints.';
comment on column public.brands.image_rules is 'MVP brand memory: future image workflow guidance; not used for image generation in MVP.';
comment on column public.brands.reference_images is 'MVP brand memory: up to 5 JPG, PNG, or WEBP reference images stored as JSON metadata/data URLs.';
