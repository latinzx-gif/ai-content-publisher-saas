import { createClient as createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export function isSingleOwnerMode(): boolean {
  return process.env.APP_MODE === 'single_owner';
}

export function getDefaultOwnerId(): string {
  return process.env.DEFAULT_OWNER_ID || '00000000-0000-0000-0000-000000000001';
}

export async function seedDefaultProfile() {
  if (!isSingleOwnerMode()) return;
  
  const adminClient = createAdminClient();
  const ownerId = getDefaultOwnerId();

  try {
    // Upsert profile record matching the ID (bypassing auth.users)
    await adminClient
      .from('profiles')
      .upsert({
        id: ownerId,
        email: 'owner@example.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });
  } catch (err) {
    console.error('Unexpected error seeding default owner profile:', err);
  }
}

export async function getCurrentOwner() {
  if (isSingleOwnerMode()) {
    // Ensure the default owner profile exists in the DB
    await seedDefaultProfile();
    return {
      id: getDefaultOwnerId(),
      email: 'owner@example.com',
    };
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function requireOwner() {
  const owner = await getCurrentOwner();
  if (!owner) {
    throw new Error('Unauthorized');
  }
  return owner;
}

export async function getDbClient() {
  if (isSingleOwnerMode()) {
    return createAdminClient();
  }
  return await createServerClient();
}
