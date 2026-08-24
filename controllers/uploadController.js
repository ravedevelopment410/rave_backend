import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

export const uploadImage = async (req, res) => {
  try {
    const { image, folder = 'aravez_uploads' } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'Image data is required' });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return res.json({
        success: true,
        message: 'Cloudinary credentials missing in backend/.env.',
        url: image,
        isCloudinary: false,
      });
    }

    // Re-configure Cloudinary dynamically
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    // Upload base64 or image URL to Cloudinary CDN
    const result = await cloudinary.uploader.upload(image, {
      folder: folder,
      resource_type: 'auto',
    });

    return res.status(200).json({
      success: true,
      message: 'Image uploaded to Cloudinary successfully 🎉',
      url: result.secure_url,
      public_id: result.public_id,
      isCloudinary: true,
    });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Cloudinary Upload Failed',
      error: error.message,
    });
  }
};
