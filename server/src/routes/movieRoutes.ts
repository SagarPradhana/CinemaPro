import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { getMovies, getMovie, createMovie, updateMovie, deleteMovie, getLatestMovies, getFeaturedMovies, syncFromTMDB, searchExternalTMDB, getExternalDetails, syncFromTVMaze, searchExternalTVMaze } from '../controllers/movieController';
import { adminAuth } from '../middleware/adminMiddleware';

const router = Router();

router.get('/', query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1, max: 50 }), getMovies);
router.get('/latest', getLatestMovies);
router.get('/featured', getFeaturedMovies);
router.get('/:id', param('id').isMongoId(), getMovie);

router.post('/',
  body('title').notEmpty().trim(),
  body('genre').optional().isArray(),
  createMovie);

router.put('/:id',
  param('id').isMongoId(),
  updateMovie);

router.delete('/:id',
  param('id').isMongoId(),
  deleteMovie);

router.post('/sync/tmdb', adminAuth, syncFromTMDB);
router.post('/sync/tvmaze', adminAuth, syncFromTVMaze);
router.get('/search/external', searchExternalTMDB);
router.get('/search/tvmaze', searchExternalTVMaze);
router.get('/external/:tmdbId', getExternalDetails);

export default router;