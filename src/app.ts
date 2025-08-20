import express from 'express';
import config from './configs/config.ts';
import session from 'express-session';
import { SESSION_CONFIG } from './configs/session.config.ts';
import authenticationRouter from './routes/xAuthentication.router.ts'
import sessionRouter from './routes/session.router.ts';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session(SESSION_CONFIG));

// Routes 
app.use('/session', sessionRouter);
app.use('/auth_x', authenticationRouter);

app.get('/', (req, res) => {
    res.send(`Welcome to Omni_Laugh ${config.nodeEnv === 'development' ? 'Development API' : 'API' } 😊👍🏻`);
})

export default app;