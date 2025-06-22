import { RequestHandler } from 'express';
import { startGame, hit, stay } from '../services/blackjackService';
import { GameState } from '../models/types';
import { recordResult } from '../services/playerService';

/* ---------------- helpers ---------------- */

const getSessionGame = (req: any): GameState => {
  if (!req.session) throw new Error('Session not available');
  return req.session.game ?? startGame();
};

const saveGame = (req: any, game: GameState) => {
  req.session.game = game;
};

/** Persist W/L/D once a game is finished */
const recordIfFinished = async (req: any, game: GameState) => {
  if (game.status === 'playing' || !req.session.userId) return;

  const outcome =
    game.status === 'player_win'   || game.status === 'dealer_bust' ? 'win'  :
    game.status === 'dealer_win'   || game.status === 'player_bust' ? 'loss' :
    'draw';

  await recordResult(req.session.userId, outcome);
};

/* ---------------- routes ---------------- */

export const start: RequestHandler = (req, res) => {
  const game = startGame();
  saveGame(req, game);
  res.json(game);
};

export const hitRoute: RequestHandler = async (req, res) => {
  let game = getSessionGame(req);

  if (game.status === 'playing') {
    game = hit(game);      // may set player_bust
    saveGame(req, game);
  }

  await recordIfFinished(req, game);
  res.json(game);
};

export const stayRoute: RequestHandler = async (req, res) => {
  let game = getSessionGame(req);

  if (game.status === 'playing') {
    game = stay(game);     // sets final status
    saveGame(req, game);
  }

  await recordIfFinished(req, game);
  res.json(game);
};

export const getState: RequestHandler = (req, res) => {
  const game = getSessionGame(req);
  res.json(game);
};
