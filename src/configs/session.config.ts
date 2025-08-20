import { type SessionOptions } from 'express-session';

export const SESSION_CONFIG: SessionOptions = {
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60,
    path: '/',
    domain: process.env.COOKIE_DOMAIN || undefined,
  },
  rolling: true,
};
