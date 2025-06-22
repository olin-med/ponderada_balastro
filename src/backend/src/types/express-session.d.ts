import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: number;
    game?: any; // optionally type this as `GameState` if you want
  }
}
