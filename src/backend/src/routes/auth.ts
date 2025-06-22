import { Router } from 'express';
import { createPlayer, loginPlayer, getStats } from '../services/playerService';

const router = Router();

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const user = await createPlayer(username, password);
  req.session.userId = user.id;
  res.json({ id: user.id, username: user.username });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await loginPlayer(username, password);
  req.session.userId = user.id;
  res.json({ id: user.id, username: user.username });
});

router.get('/me', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });
  const stats = await getStats(req.session.userId);
  res.json(stats);
});

export default router;
