import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Comic } from '../models/Comic';
import * as mangaDex from '../services/mangaDexService';

dotenv.config();

const syncComics = async () => {
  try {
    console.log('Starting MangaDex Sync...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/entertainment');
    
    const mangaList = await mangaDex.fetchTrendingManga({ 
      order: { followedCount: 'desc' },
      limit: 100 
    });

    for (const manga of mangaList) {
      const transformed = mangaDex.transformMangaDexToComic(manga);
      await Comic.findOneAndUpdate(
        { mangaDexId: transformed.mangaDexId },
        { $set: transformed },
        { upsert: true }
      );
      console.log(`Synced: ${transformed.title}`);
    }

    console.log('Sync Complete!');
    process.exit(0);
  } catch (error) {
    console.error('Sync Error:', error);
    process.exit(1);
  }
};

syncComics();
