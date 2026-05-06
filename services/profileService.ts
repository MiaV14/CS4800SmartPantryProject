import { supabase } from '@/lib/supabase';
import { OnboardingProfileUpdate, UserProfile } from '@/types/database';

const PROFILE_COLUMNS =
  'id, onboarding_completed, diet, intolerances, household_size, avatar_url';

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function uploadProfileImage(
  userId: string,
  imageUri: string
): Promise<string> {
  const fileExt = imageUri.split('.').pop()?.toLowerCase() ?? 'jpg';
  const filePath = `${userId}/profile.${fileExt}`;

  const response = await fetch(imageUri);
  const arrayBuffer = await response.arrayBuffer();

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, arrayBuffer, {
      contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

  return data.publicUrl;
}

export async function completeOnboarding(
  userId: string,
  values: OnboardingProfileUpdate
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      diet: values.diet,
      intolerances: values.intolerances,
      household_size: values.household_size,
      avatar_url: values.avatar_url ?? null,
      onboarding_completed: true,
    })
    .select(PROFILE_COLUMNS)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateProfilePreferences(
  userId: string,
  values: Partial<OnboardingProfileUpdate>
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(values)
    .eq('id', userId)
    .select(PROFILE_COLUMNS)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}