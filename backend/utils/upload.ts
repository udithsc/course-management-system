/**
 * Shared multer upload configuration.
 * Eliminates repeated multer setup across every route file.
 */
const multer = require('multer');
const fs = require('fs');
const { dirname } = require('path');

const appDir = dirname(require.main.filename);

/**
 * Creates a multer upload instance for the given subdirectory.
 * @param {string} subDir - The subdirectory under data/uploads/ (e.g., 'courses', 'authors')
 * @returns {multer.Multer} Configured multer instance
 */
const createUpload = (subDir) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = `${appDir}/data/uploads/${subDir}`;
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  return multer({ storage });
};

/**
 * Builds a full URL to an uploaded file.
 * @param {object} req - Express request object
 * @param {string} subDir - Upload subdirectory
 * @param {string} filename - The uploaded filename
 * @returns {string} Full URL
 */
const getFileUrl = (req, subDir, filename) => {
  const protocol = req.protocol || 'http';
  return `${protocol}://${req.headers.host}/files/${subDir}/${filename}`;
};

module.exports = { createUpload, getFileUrl, appDir };
