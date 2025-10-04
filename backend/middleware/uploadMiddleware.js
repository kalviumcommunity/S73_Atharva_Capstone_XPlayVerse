// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '../uploads/'));
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = `${Date.now()}_${file.originalname}`;
//     cb(null, uniqueSuffix);
//   },
// });

// export const upload = multer({ storage });

import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// ✅ Middleware to upload to Cloudinary
export const uploadToCloudinaryMiddleware = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'xplayverse',
          resource_type: 'image',
          public_id: `${Date.now()}_${req.file.originalname}`, // unique name
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    // ✅ Set Cloudinary URL so it flows with your existing code
    req.file.secure_url = result.secure_url;
    req.file.filename = result.secure_url; // for backward compatibility

    next();
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return res.status(500).json({ 
      message: 'Error uploading image', 
      error: err.message 
    });
  }
};
