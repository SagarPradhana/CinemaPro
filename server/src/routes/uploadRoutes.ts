import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary';

const router = express.Router();
const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({
      url: (req.file as any).path,
      public_id: (req.file as any).filename
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error });
  }
});

export default router;
