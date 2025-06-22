import express from 'express';
import session from 'express-session';
import blackjackRoutes from './routes/blackjack';
import authRoutes from './routes/auth';
import statsRoutes from './routes/stats';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://192.168.0.113:19006', // ← Expo dev client
  credentials: true,
}));

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // ⚠ true in production with HTTPS
    sameSite: 'lax', // or 'none' if CORS
  }
}));

app.use('/blackjack', blackjackRoutes);
app.use('/auth', authRoutes);
app.use('/stats', statsRoutes);

export default app;