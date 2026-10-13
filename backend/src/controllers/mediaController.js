const mongoose = require("mongoose");
const { getFileInfo, getFileStream } = require("../services/gridfsService");

const MIME_LOOKUP = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".avi": "video/x-msvideo",
  ".mkv": "video/x-matroska",
  ".m4v": "video/mp4",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
};

const getMimeType = (fileDoc) => {
  let mime =
    fileDoc.metadata?.contentType ||
    fileDoc.metadata?.mimetype ||
    fileDoc.contentType;

  if (mime && mime !== "application/octet-stream") {
    return mime;
  }

  const name =
    fileDoc.metadata?.originalName || fileDoc.filename || "";
  const extMatch = name.match(/\.[a-zA-Z0-9]+$/);
  if (extMatch) {
    const ext = extMatch[0].toLowerCase();
    if (MIME_LOOKUP[ext]) {
      return MIME_LOOKUP[ext];
    }
  }

  return mime || "application/octet-stream";
};

exports.getMedia = async (req, res, next) => {
  try {
    const id = req.params.id;
    const fileDoc = await getFileInfo(id);
    if (!fileDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Media not found" });
    }

    const contentType = getMimeType(fileDoc);
    const fileSize = fileDoc.length;
    const range = req.headers.range;

    if (range && typeof range === "string" && range.startsWith("bytes=")) {
      // Support standard HTTP 206 Partial Content (bytes=start-end, bytes=start-, bytes=-suffix)
      const rangeSpec = range.replace(/bytes=/, "").trim();
      const parts = rangeSpec.split("-");

      let start;
      let end;

      if (parts[0] === "" && parts[1] !== "") {
        // Suffix byte range: e.g. bytes=-500 (last 500 bytes)
        const suffixLength = parseInt(parts[1], 10);
        if (isNaN(suffixLength) || suffixLength <= 0) {
          res.setHeader("Content-Range", `bytes */${fileSize}`);
          return res.status(416).end();
        }
        start = Math.max(0, fileSize - suffixLength);
        end = fileSize - 1;
      } else {
        start = parseInt(parts[0], 10);
        end = parts[1] && parts[1].trim() !== "" ? parseInt(parts[1], 10) : fileSize - 1;
      }

      if (isNaN(start) || isNaN(end) || start < 0 || start >= fileSize || end >= fileSize || start > end) {
        res.setHeader("Content-Range", `bytes */${fileSize}`);
        return res.status(416).end();
      }

      const chunkSize = end - start + 1;
      res.status(206);
      res.setHeader("Content-Range", `bytes ${start}-${end}/${fileSize}`);
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Content-Length", chunkSize);
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

      const stream = await getFileStream(id, { start, end: Math.min(end + 1, fileSize) });
      if (!stream) {
        return res.status(404).end();
      }

      req.on("close", () => {
        if (stream && !stream.destroyed) {
          stream.destroy();
        }
      });

      stream.on("error", (err) => {
        if (!res.headersSent) {
          next(err);
        } else {
          res.end();
        }
      });
      stream.pipe(res);
    } else {
      res.status(200);
      res.setHeader("Content-Length", fileSize);
      res.setHeader("Content-Type", contentType);
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

      const stream = await getFileStream(id);
      if (!stream) {
        return res.status(404).end();
      }

      req.on("close", () => {
        if (stream && !stream.destroyed) {
          stream.destroy();
        }
      });

      stream.on("error", (err) => {
        if (!res.headersSent) {
          next(err);
        } else {
          res.end();
        }
      });
      stream.pipe(res);
    }
  } catch (error) {
    next(error);
  }
};

exports.getMediaMetadata = async (req, res, next) => {
  try {
    const fileDoc = await getFileInfo(req.params.id);
    if (!fileDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Media not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        id: req.params.id,
        filename: fileDoc.filename,
        originalName: fileDoc.metadata?.originalName || fileDoc.filename,
        contentType: getMimeType(fileDoc),
        length: fileDoc.length,
        uploadDate: fileDoc.uploadDate,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadMedia = async (req, res, next) => {
  try {
    const file = req.file || (req.files && req.files[0]);
    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    res.status(201).json({
      success: true,
      data: {
        id: file.gridfsId || file.filename,
        url: file.path || file.url,
        filename: file.filename || file.originalname,
        originalName: file.originalname,
        mimetype: file.mimetype,
      },
      url: file.path || file.url,
    });
  } catch (error) {
    next(error);
  }
};

