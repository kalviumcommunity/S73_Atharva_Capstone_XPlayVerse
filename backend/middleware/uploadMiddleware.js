import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadToCloudinaryMiddleware = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'xplayverse',
          resource_type: 'image',
          public_id: `${Date.now()}_${req.file.originalname}`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    req.file.secure_url = result.secure_url;
    req.file.filename = result.secure_url;

    next();
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return res.status(500).json({ 
      message: 'Error uploading image', 
      error: err.message 
    });
  }
};
