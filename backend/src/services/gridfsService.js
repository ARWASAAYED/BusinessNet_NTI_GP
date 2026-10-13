const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { GridFSBucket } = require("mongodb");

const getDatabase = () => {
  if (!mongoose.connection.db) {
    throw new Error("MongoDB connection is not ready");
  }
  return mongoose.connection.db;
};

const uploadFile = async (file) => {
  const bucket = new GridFSBucket(getDatabase());
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.originalname}`;
  const contentType = file.mimetype || "application/octet-stream";

  const uploadStream = bucket.openUploadStream(filename, {
    contentType,
    metadata: {
      originalName: file.originalname,
      fieldName: file.fieldname || "media",
      uploadedBy: file.userId || null,
      contentType,
      mimetype: contentType,
      fileSize: file.size || (file.buffer ? file.buffer.length : 0),
    },
  });

  await new Promise((resolve, reject) => {
    uploadStream.on("finish", resolve);
    uploadStream.on("error", reject);
    uploadStream.end(file.buffer);
  });

  return {
    id: uploadStream.id,
    filename,
    url: `/api/v1/media/${uploadStream.id.toString()}`,
    contentType,
  };
};

const getFileInfo = async (id) => {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  const bucket = new GridFSBucket(getDatabase());
  const files = await bucket.find({ _id: new ObjectId(id) }).limit(1).toArray();
  return files && files.length > 0 ? files[0] : null;
};

const getFileStream = async (id, options = {}) => {
  if (!ObjectId.isValid(id)) {
    return null;
  }
  const bucket = new GridFSBucket(getDatabase());
  return bucket.openDownloadStream(new ObjectId(id), options);
};

const deleteFile = async (id) => {
  if (!ObjectId.isValid(id)) {
    return false;
  }
  const bucket = new GridFSBucket(getDatabase());
  await bucket.delete(new ObjectId(id));
  return true;
};

module.exports = { uploadFile, getFileInfo, getFileStream, deleteFile };

