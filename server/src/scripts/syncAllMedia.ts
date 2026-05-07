import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Movie } from '../models/Movie';
import { Series } from '../models/Series';
import { Music } from '../models/Music';
import { MusicVideo } from '../models/MusicVideo';
import { Comic } from '../models/Comic';
import * as tmdbService from '../services/tmdbService';
import * as itunesService from '../services/itunesService';
import * as mangaDexService from '../services/mangaDexService';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/entertainment_db';

async function syncAll() {
  try {
    console.log('🚀 Starting Global Content Synchronization...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to Database');

    // 1. Sync Movies
    console.log('🎬 Syncing Movies from TMDB...');
    const tmdbMovies = await tmdbService.fetchTrendingMovies();
    for (const m of tmdbMovies) {
      const transformed = tmdbService.transformTMDBToMovie(m);
      await Movie.findOneAndUpdate({ tmdbId: transformed.tmdbId }, { $set: transformed }, { upsert: true });
    }
    console.log(`✅ Synced ${tmdbMovies.length} Movies`);

    // 2. Sync Series
    console.log('📺 Syncing Series from TMDB...');
    const tmdbSeries = await tmdbService.fetchTrendingSeries();
    for (const s of tmdbSeries) {
      const transformed = tmdbService.transformTMDBToSeries(s);
      await Series.findOneAndUpdate({ tmdbId: transformed.tmdbId }, { $set: transformed }, { upsert: true });
    }
    console.log(`✅ Synced ${tmdbSeries.length} Series`);

    // 3. Sync Music
    console.log('🎵 Syncing Music from iTunes...');
    const tracks = await itunesService.fetchTrendingMusic();
    for (const t of tracks) {
      const transformed = itunesService.transformITunesToMusic(t);
      await Music.findOneAndUpdate({ externalId: transformed.externalId }, { $set: transformed }, { upsert: true });
    }
    console.log(`✅ Synced ${tracks.length} Tracks`);

    // 4. Sync Music Videos
    console.log('🎥 Syncing Music Videos from iTunes...');
    const mvs = await itunesService.fetchTrendingMusicVideos();
    for (const v of mvs) {
      const transformed = itunesService.transformITunesToMusicVideo(v);
      await MusicVideo.findOneAndUpdate({ externalId: transformed.externalId }, { $set: transformed }, { upsert: true });
    }
    console.log(`✅ Synced ${mvs.length} Music Videos`);

    // 5. Sync Comics
    console.log('📚 Syncing Comics from MangaDex...');
    const mangaList = await mangaDexService.fetchTrendingManga();
    for (const m of mangaList) {
      const transformed = mangaDexService.transformMangaDexToComic(m);
      await Comic.findOneAndUpdate({ mangaDexId: transformed.mangaDexId }, { $set: transformed }, { upsert: true });
    }
    console.log(`✅ Synced ${mangaList.length} Comics`);

    console.log('🏁 Global Synchronization Complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Sync Failed:', error);
    process.exit(1);
  }
}

syncAll();
