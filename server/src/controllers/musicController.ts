import { Request, Response } from 'express';
import { Music } from '../models/Music';
import * as itunesService from '../services/itunesService';
import * as deezerService from '../services/deezerService';

export const getMusic = async (req: Request, res: Response) => {
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
        { artist: { $regex: req.query.search, $options: 'i' } },
        { album: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search as string, 'i')] } },
      ];
    }

    const music = await Music.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Music.countDocuments(query);

    res.json({
      data: music,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching music', error });
  }
};

export const getLatestMusic = async (req: Request, res: Response) => {
  try {
    const music = await Music.find({ isLatest: true }).sort({ createdAt: -1 }).limit(10);
    res.json(music);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching latest music', error });
  }
};

export const getFeaturedMusic = async (req: Request, res: Response) => {
  try {
    const music = await Music.find({ isFeatured: true }).sort({ createdAt: -1 }).limit(10);
    res.json(music);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured music', error });
  }
};

export const getMusicItem = async (req: Request, res: Response) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      return res.status(404).json({ message: 'Music not found' });
    }
    music.plays += 1;
    await music.save();
    res.json(music);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching music', error });
  }
};

export const createMusic = async (req: Request, res: Response) => {
  try {
    const music = new Music(req.body);
    await music.save();
    res.status(201).json(music);
  } catch (error) {
    res.status(400).json({ message: 'Error creating music', error });
  }
};

export const updateMusic = async (req: Request, res: Response) => {
  try {
    const music = await Music.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!music) {
      return res.status(404).json({ message: 'Music not found' });
    }
    res.json(music);
  } catch (error) {
    res.status(400).json({ message: 'Error updating music', error });
  }
};

export const deleteMusic = async (req: Request, res: Response) => {
  try {
    const music = await Music.findByIdAndDelete(req.params.id);
    if (!music) {
      return res.status(404).json({ message: 'Music not found' });
    }
    res.json({ message: 'Music deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting music', error });
  }
};

export const syncFromITunes = async (req: Request, res: Response) => {
  try {
    const term = req.query.term as string || 'top hits';
    const tracks = await itunesService.fetchTrendingMusic(term);
    const results = [];

    for (const track of tracks) {
      if (!track.trackName || !track.trackId || !track.previewUrl) continue;
      
      const transformed = itunesService.transformITunesToMusic(track);
      
      // Upsert by externalId
      const savedMusic = await Music.findOneAndUpdate(
        { externalId: transformed.externalId },
        { $set: transformed },
        { upsert: true, new: true }
      );
      results.push(savedMusic);
    }

    res.json({ 
      message: `Successfully synced ${results.length} tracks from iTunes`, 
      count: results.length,
      syncedItems: results.map(r => r.title).slice(0, 5) // Show first 5 for brevity
    });
  } catch (error) {
    res.status(500).json({ message: 'iTunes sync failed', error });
  }
};

export const syncFromDeezer = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Query parameter "q" is required' });
    
    const deezerResults = await deezerService.searchMusic(q as string);
    const results = [];

    for (const track of deezerResults) {
      const transformed = deezerService.transformDeezerToMusic(track);
      
      const savedMusic = await Music.findOneAndUpdate(
        { deezerId: transformed.deezerId },
        { $set: transformed },
        { upsert: true, new: true }
      );
      results.push(savedMusic);
    }

    res.json({ 
      message: `Successfully synced ${results.length} tracks from Deezer`, 
      count: results.length,
      syncedItems: results.map(r => r.title).slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: 'Deezer sync failed', error });
  }
};