import bcrypt from 'bcryptjs';
import { db } from '../db';

export async function createPlayer(username: string, password: string) {
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await db.query(
    `INSERT INTO players (username, password_h)
     VALUES ($1, $2)
     RETURNING id, username, wins, losses, draws`,
    [username, hash]
  );
  return rows[0];
}

export async function loginPlayer(username: string, password: string) {
  const { rows } = await db.query(
    `SELECT * FROM players WHERE username = $1`,
    [username]
  );
  const player = rows[0];
  if (!player) throw new Error('User not found');

  const ok = await bcrypt.compare(password, player.password_h);
  if (!ok) throw new Error('Invalid password');

  return player;
}

export async function recordResult(playerId: number, outcome: 'win' | 'loss' | 'draw') {
  const col = outcome === 'win' ? 'wins'
             : outcome === 'loss' ? 'losses'
             : 'draws';
  await db.query(`UPDATE players SET ${col} = ${col} + 1 WHERE id = $1`, [playerId]);
}

export async function getStats(playerId: number) {
  const { rows } = await db.query(
    `SELECT username, wins, losses, draws FROM players WHERE id = $1`,
    [playerId]
  );
  return rows[0];
}
