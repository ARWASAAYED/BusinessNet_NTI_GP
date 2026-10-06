/**
 * Supabase Storage helper for frontend
 * Used for uploading profile pictures and media directly from browser
 */
import { createClient } from '@/lib/supabase/client';

const BUCKET = 'mada-media';

/**
 * Upload a file to Supabase Storage from the browser
 * @param file - File object from input
 * @param folder - folder inside bucket e.g. 'avatars', 'posts'
 * @returns Public URL of the uploaded file
 */
export async function uploadMediaToSupabase(file: File, folder: string = 'uploads'): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

  const { data, error } = await supabase.storage.from(BUCKET).upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  return urlData.publicUrl;
}

/**
 * Delete a file from Supabase Storage by its public URL
 */
export async function deleteMediaFromSupabase(publicUrl: string): Promise<void> {
  const supabase = createClient();
  const prefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;
  if (!publicUrl.startsWith(prefix)) return;
  const filePath = publicUrl.slice(prefix.length);
  await supabase.storage.from(BUCKET).remove([filePath]);
}

export { createClient as createSupabaseClient };
