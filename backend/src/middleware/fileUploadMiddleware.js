const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
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
        fileSize: 50 * 1024 * 1024 // 50MB limi t
    },
    fileFilter: fileFilter
});
exports.uploadSingle = (fieldName) => upload.single(fieldName);
exports.uploadArray = (fieldName, maxCount) => upload.array(fieldName, maxCount);
exports.uploadFields = (fields) => upload.fields(fields);
