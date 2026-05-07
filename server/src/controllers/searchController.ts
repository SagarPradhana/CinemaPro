import { Request, Response } from 'express';
import { Movie } from '../models/Movie';
import { Series } from '../models/Series';
import { Music } from '../models/Music';
import { MusicVideo } from '../models/MusicVideo';
import { Comic } from '../models/Comic';

export const unifiedSearch = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ movies: [], series: [], music: [], musicVideos: [], comics: [] });

    const searchRegex = new RegExp(q as string, 'i');

    const [movies, series, music, musicVideos, comics] = await Promise.all([
      Movie.find({ title: searchRegex }).limit(5),
      Series.find({ title: searchRegex }).limit(5),
      Music.find({ $or: [{ title: searchRegex }, { artist: searchRegex }] }).limit(5),
      MusicVideo.find({ $or: [{ title: searchRegex }, { artist: searchRegex }] }).limit(5),
      Comic.find({ title: searchRegex }).limit(5),
    ]);

    res.json({
      movies,
      series,
      music,
      musicVideos,
      comics,
    });
  } catch (error) {
    res.status(500).json({ message: 'Unified search failed', error });
  }
};