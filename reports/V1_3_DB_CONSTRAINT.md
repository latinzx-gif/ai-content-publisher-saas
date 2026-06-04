# V1.3 DB Constraint Hardening

Date: 2026-06-04

## Migration

Path: `supabase/migrations/0008_template_key_constraint.sql`

Purpose: enforce database-level protection for V1.3 Brand Profile template keys.

## Allowed Values

- `legal-professional`
- `accounting-professional`

## SQL Behavior

- Existing `NULL` or invalid `template_key` values are normalized to `legal-professional`.
- Existing `brands_template_key_check` is dropped if present.
- A fresh `brands_template_key_check` constraint is added for the allowed values.

## Validation Commands

- `npm run typecheck`
- `npm run build`

## Manual Supabase Step

If this migration is not automatically applied by deployment, run the SQL from `supabase/migrations/0008_template_key_constraint.sql` in Supabase SQL Editor or apply the migration through the project migration workflow.

After applying, verify that direct invalid writes fail:

```sql
UPDATE public.brands
SET template_key = 'invalid-template-key'
WHERE user_id = '00000000-0000-0000-0000-000000000001';
```

Expected result: PostgreSQL rejects the update with `brands_template_key_check`.
