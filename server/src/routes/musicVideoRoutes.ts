import { Router } from 'express';
import { 
  getMusicVideos, 
  getMusicVideoItem, 
  createMusicVideo, 
  updateMusicVideo, 
  deleteMusicVideo,
  syncFromITunesVideo,
  syncFromPiped
} from '../controllers/musicVideoController';
import { adminAuth } from '../middleware/adminMiddleware';

const router = Router();

router.get('/', getMusicVideos);
router.get('/:id', getMusicVideoItem);
router.post('/', adminAuth, createMusicVideo);
router.put('/:id', adminAuth, updateMusicVideo);
router.delete('/:id', adminAuth, deleteMusicVideo);
router.post('/sync/itunes', adminAuth, syncFromITunesVideo);
router.post('/sync/piped', adminAuth, syncFromPiped);

export default router;
