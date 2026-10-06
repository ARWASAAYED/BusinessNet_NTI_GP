const multer = require('multer');
const path = require('path');
const { uploadFile } = require('../services/supabaseService');

// Use memory storage — files are processed in RAM and uploaded to Supabase (no disk writes)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: fileFilter,
});

/**
 * After multer populates req.file / req.files,
 * this middleware uploads them to Supabase and rewrites the paths to public URLs.
 */
const uploadToSupabase = async (req, res, next) => {
  try {
    // Single file: req.file
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const fileName = `${req.file.fieldname}/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const publicUrl = await uploadFile(req.file.buffer, fileName, req.file.mimetype);
      req.file.path = publicUrl;   // overwrite path with Supabase URL
      req.file.supabasePath = fileName;
    }

    // Multiple files (array): req.files as array
    if (Array.isArray(req.files) && req.files.length > 0) {
      for (const file of req.files) {
        const ext = path.extname(file.originalname);
        const fileName = `${file.fieldname}/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        const publicUrl = await uploadFile(file.buffer, fileName, file.mimetype);
        file.path = publicUrl;
        file.supabasePath = fileName;
      }
    }

    // Multiple files (fields): req.files as object
    if (req.files && !Array.isArray(req.files) && typeof req.files === 'object') {
      for (const fieldName of Object.keys(req.files)) {
        for (const file of req.files[fieldName]) {
          const ext = path.extname(file.originalname);
          const fileName = `${fieldName}/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
          const publicUrl = await uploadFile(file.buffer, fileName, file.mimetype);
          file.path = publicUrl;
          file.supabasePath = fileName;
        }
      }
    }

    next();
  } catch (error) {
    console.error('Supabase upload middleware error:', error.message);
    next(error);
  }
};

// Export helpers that chain multer + supabase upload
exports.uploadSingle = (fieldName) => [upload.single(fieldName), uploadToSupabase];
exports.uploadArray = (fieldName, maxCount) => [upload.array(fieldName, maxCount), uploadToSupabase];
exports.uploadFields = (fields) => [upload.fields(fields), uploadToSupabase];
