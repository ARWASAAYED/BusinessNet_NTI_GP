const multer = require("multer");
const { uploadFile } = require("../services/gridfsService");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const mimetype = (file.mimetype || "").toLowerCase();
  const name = (file.originalname || "").toLowerCase();
  const isImageOrVideoMime =
    mimetype.startsWith("image/") || mimetype.startsWith("video/");
  const isImageOrVideoExt =
    /\.(jpe?g|png|gif|webp|svg|bmp|heic|heif|mp4|webm|mov|mkv|avi|m4v|3gp|flv)$/i.test(name);

  if (isImageOrVideoMime || isImageOrVideoExt) {
    if (!mimetype || mimetype === "application/octet-stream") {
      if (/\.(mp4|m4v)$/i.test(name)) file.mimetype = "video/mp4";
      else if (/\.webm$/i.test(name)) file.mimetype = "video/webm";
      else if (/\.mov$/i.test(name)) file.mimetype = "video/quicktime";
      else if (/\.3gp$/i.test(name)) file.mimetype = "video/3gpp";
      else if (/\.png$/i.test(name)) file.mimetype = "image/png";
      else if (/\.(jpe?g)$/i.test(name)) file.mimetype = "image/jpeg";
      else if (/\.webp$/i.test(name)) file.mimetype = "image/webp";
      else if (/\.gif$/i.test(name)) file.mimetype = "image/gif";
    }
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed!"), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB for modern photos and videos
  },
  fileFilter,
});

const uploadToGridFS = async (req, res, next) => {
  try {
    const files = req.file
      ? [req.file]
      : Array.isArray(req.files)
        ? req.files
        : Object.values(req.files || {}).flat();

    for (const file of files) {
      if (!file.buffer) continue;
      file.userId = req.user?._id?.toString() || null;
      file.fieldname = file.fieldname || "media";
      const storedFile = await uploadFile(file);
      file.path = storedFile.url;
      file.url = storedFile.url;
      file.filename = storedFile.filename;
      file.gridfsId = storedFile.id.toString();
    }

    next();
  } catch (error) {
    console.error("GridFS upload middleware error:", error.message);
    next(error);
  }
};

exports.uploadSingle = (fieldName) => [
  upload.single(fieldName),
  uploadToGridFS,
];
exports.uploadArray = (fieldName, maxCount) => [
  upload.array(fieldName, maxCount),
  uploadToGridFS,
];
exports.uploadFields = (fields) => [upload.fields(fields), uploadToGridFS];
