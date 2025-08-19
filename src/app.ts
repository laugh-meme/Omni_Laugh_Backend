import express from 'express';
import config from './configs/config.ts';

import authentication from './routes/xAuthentication.router.ts'

const app = express();
app.use(express.json());

// Routes 
app.use('/auth_x', authentication);

app.get('/', (req, res) => {
    res.send(`Welcome to Omni_Laugh ${config.nodeEnv === 'development' ? 'Development API' : 'API' } 😊👍🏻`);
})

export default app;