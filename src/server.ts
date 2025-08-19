import app from './app.ts'
import config from './configs/config.ts';

app.listen(config.port, () => {
  	console.log(`Server running on port ${config.port}`);
});