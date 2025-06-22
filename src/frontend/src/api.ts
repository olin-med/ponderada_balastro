import axios from 'axios';

const API_BASE = 'http://192.168.0.113:3000';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

/* -------------- Blackjack -------------- */
export const startGame  = () => api.post('/blackjack/start');
export const hit        = () => api.post('/blackjack/hit');
export const stay       = () => api.post('/blackjack/stay');
export const getState   = () => api.get ('/blackjack/state');

/* -------------- Auth ------------------- */
export const signup = (u: string, p: string) => api.post('/auth/signup', { username: u, password: p });
export const login  = (u: string, p: string) => api.post('/auth/login',  { username: u, password: p });
export const logout = ()                   => api.post('/auth/logout');        // we’ll add the route below
export const getMe  = ()                   => api.get ('/auth/me');

/* -------------- Stats ------------------ */
export const getLeaderboard = () => api.get('/stats/leaderboard');
