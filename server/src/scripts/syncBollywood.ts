import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Movie } from '../models/Movie';
import { Series } from '../models/Series';
import { Music } from '../models/Music';
import { MusicVideo } from '../models/MusicVideo';
import * as tvMaze from '../services/tvMazeService';
import * as deezer from '../services/deezerService';
import * as piped from '../services/pipedService';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/entertainment_db';

const syncBollywoodContent = async () => {
  try {
    console.log('🚀 Starting Bollywood Special Synchronization...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to Database');

    const keywords = ['Bollywood', 'Hindi', 'Indian', 'Sharukh Khan', 'Salman Khan', 'Arijit Singh'];

    // 1. Sync Bollywood Series/Shows from TVMaze
    console.log('📺 Syncing Bollywood Series from TVMaze...');
    for (const kw of keywords) {
      const shows = await tvMaze.searchTVShows(kw);
      for (const s of shows) {
        const transformed = tvMaze.transformTVMazeToSeries(s);
        await Series.findOneAndUpdate(
          { tvMazeId: transformed.tvMazeId },
          { $set: { ...transformed, tags: [...(transformed.genre || []), 'Bollywood', 'Hindi'] } },
          { upsert: true }
        );
      }
    }
    console.log('✅ Synced Bollywood Series');

    // 2. Sync Bollywood Movies (using TVMaze as a fallback/primary keyless source)
    console.log('🎬 Syncing Bollywood Movies from TVMaze...');
    for (const kw of keywords) {
      const shows = await tvMaze.searchTVShows(kw);
      for (const s of shows) {
        // TVMaze returns shows, but we can treat them as movies if the user wants keyless movie sync
        const transformed = tvMaze.transformTVMazeToSeries(s);
        await Movie.findOneAndUpdate(
          { tvMazeId: transformed.tvMazeId },
          { 
            $set: { 
              title: transformed.title,
              description: transformed.description,
              genre: transformed.genre,
              language: transformed.language,
              releaseYear: transformed.releaseYear,
              rating: transformed.rating,
              posterImage: transformed.posterImage,
              backdropImage: transformed.backdropImage,
              movieLink: transformed.movieLink,
              isLatest: true,
              tvMazeId: transformed.tvMazeId,
              tags: ['Bollywood', 'Hindi', 'Indian Movie']
            } 
          },
          { upsert: true }
        );
      }
    }
    console.log('✅ Synced Bollywood Movies');

    // 3. Sync Bollywood Music from Deezer
    console.log('🎵 Syncing Bollywood Music from Deezer...');
    for (const kw of ['Bollywood Hits', 'Arijit Singh', 'Hindi Songs', 'Indian Pop']) {
      const tracks = await deezer.searchMusic(kw);
      for (const t of tracks) {
        const transformed = deezer.transformDeezerToMusic(t);
        await Music.findOneAndUpdate(
          { deezerId: transformed.deezerId },
          { $set: { ...transformed, tags: ['Bollywood', 'Hindi', 'Music'] } },
          { upsert: true }
        );
      }
    }
    console.log('✅ Synced Bollywood Music');

    // 4. Sync Bollywood Music Videos from Piped
    console.log('🎥 Syncing Bollywood Music Videos from Piped...');
    for (const kw of ['Bollywood Music Videos', 'Hindi Songs Video', 'T-Series']) {
      const videos = await piped.searchVideos(kw);
      for (const v of videos) {
        const transformed = piped.transformPipedToMusicVideo(v);
        await MusicVideo.findOneAndUpdate(
          { pipedId: transformed.pipedId },
          { $set: { ...transformed, tags: ['Bollywood', 'Hindi', 'Video'] } },
          { upsert: true }
        );
      }
    }
    console.log('✅ Synced Bollywood Music Videos');

    console.log('🏁 Bollywood Special Sync Complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Sync Failed:', error);
    process.exit(1);
  }
};

syncBollywoodContent();
