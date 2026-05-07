import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { getComics, getComic, createComic, updateComic, deleteComic, addChapter, syncFromMangaDex, searchMangaDex } from '../controllers/comicController';
import { adminAuth } from '../middleware/adminMiddleware';

const router = Router();

router.get('/', query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1, max: 50 }), getComics);
router.get('/:id', param('id').isMongoId(), getComic);

router.post('/',
  body('title').notEmpty().trim(),
  body('type').optional().isIn(['comic', 'manga', 'manhwa']),
  createComic);

router.put('/:id',
  param('id').isMongoId(),
  updateComic);

router.delete('/:id',
  param('id').isMongoId(),
  deleteComic);

router.post('/:id/chapters',
  param('id').isMongoId(),
  body('chapterNumber').isInt({ min: 1 }),
  addChapter);

router.post('/sync/mangadex', adminAuth, syncFromMangaDex);
router.get('/search/external', searchMangaDex);

export default router;