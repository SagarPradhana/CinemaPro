import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { getSeries, getSeriesItem, createSeries, updateSeries, deleteSeries, addEpisode, updateEpisode, syncFromTMDBSeries, getExternalDetails, syncFromTVMaze, syncFromJikan } from '../controllers/seriesController';
import { adminAuth } from '../middleware/adminMiddleware';

const router = Router();

router.get('/', query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1, max: 50 }), getSeries);
router.get('/:id', param('id').isMongoId(), getSeriesItem);

router.post('/',
  body('title').notEmpty().trim(),
  body('type').isIn(['series', 'drama', 'anime']),
  createSeries);

router.put('/:id',
  param('id').isMongoId(),
  updateSeries);

router.delete('/:id',
  param('id').isMongoId(),
  deleteSeries);

router.post('/:id/seasons/:seasonNumber/episodes',
  param('id').isMongoId(),
  param('seasonNumber').isInt({ min: 1 }),
  addEpisode);

router.put('/:id/seasons/:seasonNumber/episodes/:episodeId',
  param('id').isMongoId(),
  param('seasonNumber').isInt({ min: 1 }),
  param('episodeId').isMongoId(),
  updateEpisode);

router.post('/sync/tmdb', adminAuth, syncFromTMDBSeries);
router.post('/sync/tvmaze', adminAuth, syncFromTVMaze);
router.post('/sync/jikan', adminAuth, syncFromJikan);
router.get('/external/:tmdbId', getExternalDetails);

export default router;