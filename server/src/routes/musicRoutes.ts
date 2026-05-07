import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { getMusic, getMusicItem, createMusic, updateMusic, deleteMusic, getLatestMusic, getFeaturedMusic, syncFromITunes, syncFromDeezer } from '../controllers/musicController';
import { adminAuth } from '../middleware/adminMiddleware';

const router = Router();

router.get('/', query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1, max: 50 }), getMusic);
router.get('/latest', getLatestMusic);
router.get('/featured', getFeaturedMusic);
router.get('/:id', param('id').isMongoId(), getMusicItem);

router.post('/',
  body('title').notEmpty().trim(),
  body('artist').notEmpty().trim(),
  createMusic);

router.put('/:id',
  param('id').isMongoId(),
  updateMusic);

router.delete('/:id',
  param('id').isMongoId(),
  deleteMusic);

router.post('/sync/itunes', adminAuth, syncFromITunes);
router.post('/sync/deezer', adminAuth, syncFromDeezer);

export default router;