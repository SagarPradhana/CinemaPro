import { Request, Response } from 'express';
import { Movie } from '../models/Movie';
import mongoose from 'mongoose';
import * as tmdbService from '../services/tmdbService';
import * as tvMazeService from '../services/tvMazeService';

export const getMovies = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    if (req.query.isLatest === 'true') query.isLatest = true;
    if (req.query.isFeatured === 'true') query.isFeatured = true;
    if (req.query.genre) query.genre = req.query.genre;
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search as string, 'i')] } },
        { genre: { $in: [new RegExp(req.query.search as string, 'i')] } },
      ];
    }

    const movies = await Movie.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Movie.countDocuments(query);

    res.json({
      data: movies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies', error });
  }
};

export const getLatestMovies = async (req: Request, res: Response) => {
  try {
    const movies = await Movie.find({ isLatest: true }).sort({ createdAt: -1 }).limit(10);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching latest movies', error });
  }
};

export const getFeaturedMovies = async (req: Request, res: Response) => {
  try {
    const movies = await Movie.find({ isFeatured: true }).sort({ createdAt: -1 }).limit(10);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured movies', error });
  }
};

export const getMovie = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    movie.views += 1;
    await movie.save();
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movie', error });
  }
};

export const createMovie = async (req: Request, res: Response) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ message: 'Error creating movie', error });
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(400).json({ message: 'Error updating movie', error });
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting movie', error });
  }
};

export const syncFromTMDB = async (req: Request, res: Response) => {
  try {
    const tmdbMovies = await tmdbService.fetchTrendingMovies();
    const results = [];

    for (const movie of tmdbMovies) {
      if (!movie.title || !movie.id) continue;
      
      const transformed = tmdbService.transformTMDBToMovie(movie);
      
      // Upsert by tmdbId
      const savedMovie = await Movie.findOneAndUpdate(
        { tmdbId: transformed.tmdbId },
        { $set: transformed },
        { upsert: true, new: true }
      );
      results.push(savedMovie);
    }

    res.json({ 
      message: `Successfully synced ${results.length} movies from TMDB`, 
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
    const query = (q as string) || 'Bollywood';
    const tvMazeShows = await tvMazeService.searchTVShows(query);
    const results = [];

    for (const data of tvMazeShows) {
      const show = data.show || data;
      if (!show.name || !show.id) continue;
      
      const transformed = tvMazeService.transformTVMazeToSeries(data);
      
      const savedMovie = await Movie.findOneAndUpdate(
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
            tags: ['TVMaze-Synced', 'Bollywood']
          } 
        },
        { upsert: true, new: true }
      );
      results.push(savedMovie);
    }

    res.json({ 
      message: `Successfully synced ${results.length} movies from TVMaze`, 
      count: results.length,
      syncedItems: results.map(r => r.title).slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: 'TVMaze sync failed', error });
  }
};


export const searchExternalTMDB = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    const results = await tmdbService.searchTMDBMovies(q as string);
    const transformed = results.map(tmdbService.transformTMDBToMovie);
    res.json(transformed);
  } catch (error) {
    res.status(500).json({ message: 'External TMDB search failed', error });
  }
};

export const searchExternalTVMaze = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    const results = await tvMazeService.searchTVShows(q as string);
    const transformed = results.map((r: any) => {
      const series = tvMazeService.transformTVMazeToSeries(r);
      return { ...series, type: 'movie' };
    });
    res.json(transformed);
  } catch (error) {
    res.status(500).json({ message: 'External TVMaze search failed', error });
  }
};

export const getExternalDetails = async (req: Request, res: Response) => {
  try {
    const { tmdbId } = req.params;
    const details = await tmdbService.getMovieDetails(parseInt(tmdbId));
    res.json(details);
  } catch (error) {
    res.status(500).json({ message: 'External TMDB details fetch failed', error });
  }
};