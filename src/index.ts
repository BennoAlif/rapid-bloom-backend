import 'module-alias/register';

import server from './server';
import logger from './utils/logger';

const port = process.env.PORT || 3000;

server.listen(port, () => {
  logger.info(`⚡️[server]: Server is running at http://localhost:${port}`);
});
