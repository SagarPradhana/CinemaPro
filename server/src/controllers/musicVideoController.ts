import { Request, Response } from 'express';
import { MusicVideo } from '../models/MusicVideo';
import * as itunesService from '../services/itunesService';
import * as pipedService from '../services/pipedService';

export const getMusicVideos = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};

    if (req.query.isLatest === 'true') query.isLatest = true;
    if (req.query.isFeatured === 'true') query.isFeatured = true;
    if (req.query.genre) query.genre = req.query.genre;
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { artist: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const videos = await MusicVideo.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await MusicVideo.countDocuments(query);

    res.json({
      data: videos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching music videos', error });
  }
};

export const getMusicVideoItem = async (req: Request, res: Response) => {
  try {
    const video = await MusicVideo.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Music video not found' });
    }
    video.views += 1;
    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching music video', error });
  }
};

export const createMusicVideo = async (req: Request, res: Response) => {
  try {
    const video = new MusicVideo(req.body);
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ message: 'Error creating music video', error });
  }
};

export const updateMusicVideo = async (req: Request, res: Response) => {
  try {
    const video = await MusicVideo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!video) {
      return res.status(404).json({ message: 'Music video not found' });
    }
    res.json(video);
  } catch (error) {
    res.status(400).json({ message: 'Error updating music video', error });
  }
};

export const deleteMusicVideo = async (req: Request, res: Response) => {
  try {
    const video = await MusicVideo.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Music video not found' });
    }
    res.json({ message: 'Music video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting music video', error });
  }
};

export const syncFromITunesVideo = async (req: Request, res: Response) => {
  try {
    const term = req.query.term as string || 'top hits';
    const videos = await itunesService.fetchTrendingMusicVideos(term);
    const results = [];

    for (const video of videos) {
      if (!video.trackName || !video.trackId || !video.previewUrl) continue;
      
      const transformed = itunesService.transformITunesToMusicVideo(video);
      
      // Upsert by externalId
      const savedVideo = await MusicVideo.findOneAndUpdate(
        { externalId: transformed.externalId },
        { $set: transformed },
        { upsert: true, new: true }
      );
      results.push(savedVideo);
    }

    res.json({ 
      message: `Successfully synced ${results.length} music videos from iTunes`, 
      count: results.length,
      syncedItems: results.map(r => r.title).slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: 'iTunes sync failed', error });
  }
};

export const syncFromPiped = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Query parameter "q" is required' });
    
    const pipedResults = await pipedService.searchVideos(q as string);
    const results = [];

    for (const video of pipedResults) {
      const transformed = pipedService.transformPipedToMusicVideo(video);
      
      const savedVideo = await MusicVideo.findOneAndUpdate(
        { pipedId: transformed.pipedId },
        { $set: transformed },
        { upsert: true, new: true }
      );
      results.push(savedVideo);
    }

    res.json({ 
      message: `Successfully synced ${results.length} videos from Piped`, 
      count: results.length,
      syncedItems: results.map(r => r.title).slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: 'Piped sync failed', error });
  }
};
