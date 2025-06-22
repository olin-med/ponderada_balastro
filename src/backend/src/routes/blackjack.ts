import { Router } from 'express';
import { start, hitRoute, stayRoute, getState } from '../controllers/blackjackController';

const router = Router();

router.post('/start', start);
router.post('/hit', hitRoute);
router.post('/stay', stayRoute);
router.get('/state', getState);

export default router;
