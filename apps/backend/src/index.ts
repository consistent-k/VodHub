import { serve } from '@hono/node-server';
import { Hono } from 'hono';

import app from '@/app';
import { config } from '@/config';
import tmdbApp from '@/tmdb/app';
import { getLocalhostAddress } from '@/utils/common-utils';
import logger from '@/utils/logger';

const isDev = process.env.NODE_ENV !== 'production';
logger.info(`🚀 Server running in ${isDev ? 'development' : 'production'} mode`);

const port = config.connect.port;
const hostIPList = getLocalhostAddress();

if (config.connect.listenInaddrAny) {
    for (const ip of hostIPList) {
        logger.info(`🔗 Network: 👉 http://${ip}:${port}`);
    }
}

logger.info(`⚙ Config: 👉 ${JSON.stringify(config, null, 2)}`);

const root = new Hono();
root.route('/', app);
root.route('/', tmdbApp);

const server = serve({
    fetch: root.fetch,
    hostname: config.connect.listenInaddrAny ? '::' : '127.0.0.1',
    port
});

export default server;
