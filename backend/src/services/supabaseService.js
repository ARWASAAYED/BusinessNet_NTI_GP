const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl === 'YOUR_SUPABASE_URL_HERE') {
  console.warn('⚠️  Supabase not configured. File uploads will fail. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env');
}

const supabase = supabaseUrl && supabaseKey && supabaseUrl !== 'YOUR_SUPABASE_URL_HERE'
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const fs = require('fs');
const path = require('path');

/**
 * Upload a file buffer to Supabase Storage.
 * Falls back to local /uploads directory if Supabase is unconfigured or fails (e.g. bucket doesn't exist yet).
 * @param {Buffer} buffer - File buffer
 * @param {string} fileName - Destination path inside the bucket (e.g. "posts/abc123.jpg")
 * @param {string} mimeType - MIME type of the file
 * @param {string} bucket - Supabase bucket name (default: 'mada-media')
 * @returns {Promise<string>} - Public URL or local URL of the uploaded file
 */
const uploadFile = async (buffer, fileName, mimeType, bucket = 'mada-media') => {
  // If supabase is initialized, attempt upload
  if (supabase) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, buffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (!error && data) {
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
        if (urlData?.publicUrl) {
          return urlData.publicUrl;
        }
      } else if (error) {
        console.warn(`⚠️ Supabase upload notice: ${error.message}. Falling back to local disk storage.`);
      }
    } catch (err) {
      console.warn(`⚠️ Supabase upload exception: ${err.message}. Falling back to local disk storage.`);
    }
  }

  // Graceful Fallback: write to local /uploads directory
  try {
    const localUploadsDir = path.join(__dirname, '../../uploads');
    const safeSubDir = path.join(localUploadsDir, path.dirname(fileName));
    if (!fs.existsSync(safeSubDir)) {
      fs.mkdirSync(safeSubDir, { recursive: true });
    }
    const localFilePath = path.join(localUploadsDir, fileName);
    fs.writeFileSync(localFilePath, buffer);
    console.log(`💾 File saved to local storage: /uploads/${fileName.replace(/\\/g, '/')}`);
    return `/uploads/${fileName.replace(/\\/g, '/')}`;
  } catch (fsError) {
    console.error('❌ Failed to save file locally as fallback:', fsError.message);
    throw new Error('File upload failed on both Supabase and local storage.');
  }
};

/**
 * Delete a file from Supabase Storage.
 * @param {string} filePath - Path inside the bucket (e.g. "posts/abc123.jpg")
 * @param {string} bucket - Supabase bucket name
 */
const deleteFile = async (filePath, bucket = 'mada-media') => {
  if (!supabase) return;
  const { error } = await supabase.storage.from(bucket).remove([filePath]);
  if (error) {
    console.error('Supabase delete error:', error.message);
  }
};

/**
 * Extract the file path from a Supabase public URL.
 * Useful when you want to delete a file given its URL.
 * @param {string} publicUrl
 * @param {string} bucket
 * @returns {string|null}
 */
const extractPathFromUrl = (publicUrl, bucket = 'mada-media') => {
  if (!publicUrl || !supabaseUrl) return null;
  try {
    const prefix = `${supabaseUrl}/storage/v1/object/public/${bucket}/`;
    return publicUrl.startsWith(prefix) ? publicUrl.slice(prefix.length) : null;
  } catch {
    return null;
  }
};

module.exports = { uploadFile, deleteFile, extractPathFromUrl, supabase };
