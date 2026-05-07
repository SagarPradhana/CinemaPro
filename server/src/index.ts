import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import movieRoutes from './routes/movieRoutes';
import musicRoutes from './routes/musicRoutes';
import seriesRoutes from './routes/seriesRoutes';
import comicRoutes from './routes/comicRoutes';
import homeRoutes from './routes/homeRoutes';
import searchRoutes from './routes/searchRoutes';
import uploadRoutes from './routes/uploadRoutes';
import musicVideoRoutes from './routes/musicVideoRoutes';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173',
    'https://*.netlify.app',
    'https://*.netlify.com'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/music', musicRoutes);
app.use('/api/v1/series', seriesRoutes);
app.use('/api/v1/dramas', seriesRoutes);
app.use('/api/v1/anime', seriesRoutes);
app.use('/api/v1/comics', comicRoutes);
app.use('/api/v1/home', homeRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/music-videos', musicVideoRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/entertainment')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

export default app;