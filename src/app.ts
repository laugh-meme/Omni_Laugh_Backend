import express from 'express';
import rateLimit from 'express-rate-limit';
import session from 'express-session';

import config from './configs/config.ts';
import { SESSION_CONFIG } from './configs/session.config.ts';
import { RATE_LIMITER_CONFIG } from './configs/rate_limiter.config.ts';
import { errorHandler } from './middlewares/errorHandler.middleware.ts';
import xAuthenticationRouter from './routes/xAuthentication.router.ts'
import sessionRouter from './routes/session.router.ts';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session(SESSION_CONFIG));
app.use(rateLimit(RATE_LIMITER_CONFIG));

// Routes 
app.use('/session', sessionRouter);
app.use('/auth_x', xAuthenticationRouter);

app.get('/', (req, res) => {
    res.send(`Welcome to Omni_Laugh ${config.nodeEnv === 'development' ? 'Development API' : 'API' } 😊👍🏻`);
})

// Error Handle Middleware
app.use(errorHandler);

export default app;