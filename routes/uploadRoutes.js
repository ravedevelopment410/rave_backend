import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';

const router = express.Router();

// POST /api/upload - Upload base64 image to Cloudinary
router.post('/', uploadImage);

export default router;
