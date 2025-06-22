import { Router } from 'express';
import { db } from '../db';

const router = Router();

router.get('/leaderboard', async (_req, res) => {
  const { rows } = await db.query(`
    SELECT username, wins, losses, draws,
           (wins::float / NULLIF(wins + losses + draws, 0)) AS win_rate
    FROM players
    ORDER BY win_rate DESC NULLS LAST, wins DESC
    LIMIT 10
  `);
  res.json(rows);
});

export default router;
