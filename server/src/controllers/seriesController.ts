import { Request, Response } from 'express';
import { Series } from '../models/Series';
import * as tmdbService from '../services/tmdbService';
import * as tvMazeService from '../services/tvMazeService';
import * as jikanService from '../services/jikanService';

export const getSeries = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    if (req.query.isLatest === 'true') query.isLatest = true;
    if (req.query.isFeatured === 'true') query.isFeatured = true;
    if (req.query.genre) query.genre = req.query.genre;
    if (req.query.type) query.type = req.query.type;
    if (req.query.status) query.status = req.query.status;
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search as string, 'i')] } },
        { genre: { $in: [new RegExp(req.query.search as string, 'i')] } },
      ];
    }

    const series = await Series.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Series.countDocuments(query);

    res.json({
      data: series,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching series', error });
  }
};

export const getSeriesItem = async (req: Request, res: Response) => {
  try {
    const series = await Series.findById(req.params.id);
    if (!series) {
      return res.status(404).json({ message: 'Series not found' });
    }
    res.json(series);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching series', error });
  }
};

export const createSeries = async (req: Request, res: Response) => {
  try {
    const series = new Series(req.body);
    await series.save();
    res.status(201).json(series);
  } catch (error) {
    res.status(400).json({ message: 'Error creating series', error });
  }
};

export const updateSeries = async (req: Request, res: Response) => {
  try {
    const series = await Series.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!series) {
      return res.status(404).json({ message: 'Series not found' });
    }
    res.json(series);
  } catch (error) {
    res.status(400).json({ message: 'Error updating series', error });
  }
};

export const deleteSeries = async (req: Request, res: Response) => {
  try {
    const series = await Series.findByIdAndDelete(req.params.id);
    if (!series) {
      return res.status(404).json({ message: 'Series not found' });
    }
    res.json({ message: 'Series deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting series', error });
  }
};

export const addEpisode = async (req: Request, res: Response) => {
  try {
    const series = await Series.findById(req.params.id);
    if (!series) {
      return res.status(404).json({ message: 'Series not found' });
    }

    const seasonNumber = parseInt(req.params.seasonNumber);
    let season = series.seasons.find(s => s.seasonNumber === seasonNumber);

    if (!season) {
      season = { seasonNumber, title: `Season ${seasonNumber}`, episodes: [] };
      series.seasons.push(season);
    }

    season.episodes.push(req.body);
    await series.save();
    res.status(201).json(series);
  } catch (error) {
    res.status(400).json({ message: 'Error adding episode', error });
  }
};

export const updateEpisode = async (req: Request, res: Response) => {
  try {
    const series = await Series.findById(req.params.id);
    if (!series) {
      return res.status(404).json({ message: 'Series not found' });
    }

    const seasonNumber = parseInt(req.params.seasonNumber);
    const season = series.seasons.find(s => s.seasonNumber === seasonNumber);

    if (!season) {
      return res.status(404).json({ message: 'Season not found' });
    }

    const episode = season.episodes.find(e => e._id?.toString() === req.params.episodeId);
    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    Object.assign(episode, req.body);
    await series.save();
    res.json(series);
  } catch (error) {
    res.status(400).json({ message: 'Error updating episode', error });
  }
};

export const syncFromTMDBSeries = async (req: Request, res: Response) => {
  try {
    const tmdbSeriesList = await tmdbService.fetchTrendingSeries();
    const results = [];

    for (const series of tmdbSeriesList) {
      if (!series.name || !series.id) continue;
      
      const transformed = tmdbService.transformTMDBToSeries(series);
      
      // Upsert by tmdbId
      const savedSeries = await Series.findOneAndUpdate(
        { tmdbId: transformed.tmdbId },
        { $set: transformed },
        { upsert: true, new: true }
      );
      results.push(savedSeries);
    }

    res.json({ 
      message: `Successfully synced ${results.length} series from TMDB`, 
      count: results.length,
      syncedItems: results.map(r => r.title).slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: 'TMDB sync failed', error });
  }
};


export const syncFromTVMaze = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Query parameter "q" is required' });
    
    const tvMazeResults = await tvMazeService.searchTVShows(q as string);
    const results = [];

    for (const item of tvMazeResults) {
      const transformed = tvMazeService.transformTVMazeToSeries(item);
      
      const savedSeries = await Series.findOneAndUpdate(
        { tvMazeId: transformed.tvMazeId },
        { $set: { ...transformed, type: 'series' } },
        { upsert: true, new: true }
      );
      results.push(savedSeries);
    }

    res.json({ 
      message: `Successfully synced ${results.length} series from TVMaze`, 
      count: results.length,
      syncedItems: results.map(r => r.title).slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: 'TVMaze sync failed', error });
  }
};

export const syncFromJikan = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Query parameter "q" is required' });
    
    const jikanResults = await jikanService.searchAnime(q as string);
    const results = [];

    for (const anime of jikanResults) {
      const transformed = jikanService.transformJikanToAnime(anime);
      
      const savedSeries = await Series.findOneAndUpdate(
        { malId: transformed.malId },
        { $set: { ...transformed, type: 'anime' } },
        { upsert: true, new: true }
      );
      results.push(savedSeries);
    }

    res.json({ 
      message: `Successfully synced ${results.length} anime from Jikan`, 
      count: results.length,
      syncedItems: results.map(r => r.title).slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: 'Jikan sync failed', error });
  }
};

export const getExternalDetails = async (req: Request, res: Response) => {
  try {
    const { tmdbId } = req.params;
    const details = await tmdbService.getSeriesDetails(parseInt(tmdbId));
    res.json(details);
  } catch (error) {
    res.status(500).json({ message: 'External TMDB series details fetch failed', error });
  }
};