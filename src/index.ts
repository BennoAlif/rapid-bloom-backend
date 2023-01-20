import server from './server';
import logger from './utils/logger';

const port = process.env.SERVER_PORT || 3001;

server.listen(port, () => {
  logger.info(`⚡️[server]: Server is running at http://localhost:${port}`);
});
