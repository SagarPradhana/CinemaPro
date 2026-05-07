import { Request, Response } from 'express';
import { Movie } from '../models/Movie';
import { Music } from '../models/Music';
import { Series } from '../models/Series';
import { Comic } from '../models/Comic';

export const getHomeData = async (req: Request, res: Response) => {
  try {
    const [movies, music, series, comics] = await Promise.all([
      Movie.find({ $or: [{ isFeatured: true }, { isLatest: true }] }).sort({ createdAt: -1 }).limit(10),
      Music.find({ $or: [{ isFeatured: true }, { isLatest: true }] }).sort({ createdAt: -1 }).limit(10),
      Series.find({ $or: [{ isFeatured: true }, { isLatest: true }] }).sort({ createdAt: -1 }).limit(10),
      Comic.find({ $or: [{ isFeatured: true }, { isLatest: true }] }).sort({ createdAt: -1 }).limit(10),
    ]);

    const featuredMovies = movies.filter(m => m.isFeatured);
    const latestMovies = movies.filter(m => m.isLatest);

    const featuredMusic = music.filter(m => m.isFeatured);
    const latestMusic = music.filter(m => m.isLatest);

    const featuredSeries = series.filter(s => s.isFeatured);
    const latestSeries = series.filter(s => s.isLatest);

    const featuredComics = comics.filter(c => c.isFeatured);
    const latestComics = comics.filter(c => c.isLatest);

    res.json({
      movies: { featured: featuredMovies, latest: latestMovies },
      music: { featured: featuredMusic, latest: latestMusic },
      series: { featured: featuredSeries, latest: latestSeries },
      comics: { featured: featuredComics, latest: latestComics },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching home data', error });
  }
};