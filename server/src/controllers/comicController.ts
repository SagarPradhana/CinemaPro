import { Request, Response } from 'express';
import { Comic } from '../models/Comic';
import * as mangaDex from '../services/mangaDexService';

export const getComics = async (req: Request, res: Response) => {
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
        { author: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search as string, 'i')] } },
        { genre: { $in: [new RegExp(req.query.search as string, 'i')] } },
      ];
    }

    const comics = await Comic.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Comic.countDocuments(query);

    res.json({
      data: comics,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comics', error });
  }
};

export const getComic = async (req: Request, res: Response) => {
  try {
    const comic = await Comic.findById(req.params.id);
    if (!comic) {
      return res.status(404).json({ message: 'Comic not found' });
    }
    comic.views += 1;
    await comic.save();
    res.json(comic);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comic', error });
  }
};

export const createComic = async (req: Request, res: Response) => {
  try {
    const comic = new Comic(req.body);
    await comic.save();
    res.status(201).json(comic);
  } catch (error) {
    res.status(400).json({ message: 'Error creating comic', error });
  }
};

export const updateComic = async (req: Request, res: Response) => {
  try {
    const comic = await Comic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!comic) {
      return res.status(404).json({ message: 'Comic not found' });
    }
    res.json(comic);
  } catch (error) {
    res.status(400).json({ message: 'Error updating comic', error });
  }
};

export const deleteComic = async (req: Request, res: Response) => {
  try {
    const comic = await Comic.findByIdAndDelete(req.params.id);
    if (!comic) {
      return res.status(404).json({ message: 'Comic not found' });
    }
    res.json({ message: 'Comic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comic', error });
  }
};

export const addChapter = async (req: Request, res: Response) => {
  try {
    const comic = await Comic.findById(req.params.id);
    if (!comic) {
      return res.status(404).json({ message: 'Comic not found' });
    }

    comic.chapters.push(req.body);
    await comic.save();
    res.status(201).json(comic);
  } catch (error) {
    res.status(400).json({ message: 'Error adding chapter', error });
  }
};

export const syncFromMangaDex = async (req: Request, res: Response) => {
  try {
    const mangaList = await mangaDex.fetchTrendingManga({ 
      limit: 50 
    });

    const results = [];
    for (const manga of mangaList) {
      const transformed = mangaDex.transformMangaDexToComic(manga);
      
      // Upsert by mangaDexId
      const comic = await Comic.findOneAndUpdate(
        { mangaDexId: transformed.mangaDexId },
        { $set: transformed },
        { upsert: true, new: true }
      );
      results.push(comic);
    }

    res.json({ message: `Successfully synced ${results.length} comics`, count: results.length });
  } catch (error) {
    res.status(500).json({ message: 'Sync failed', error });
  }
};

export const searchMangaDex = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    const mangaList = await mangaDex.fetchTrendingManga({ title: q as string, limit: 10 });
    const transformed = mangaList.map(mangaDex.transformMangaDexToComic);
    res.json(transformed);
  } catch (error) {
    res.status(500).json({ message: 'External search failed', error });
  }
};