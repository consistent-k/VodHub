import { serve } from '@hono/node-server';

import app from '@/app';
import { config } from '@/config';
import { getLocalhostAddress } from '@/utils/common-utils';
import logger from '@/utils/logger';

const port = config.connect.port;
const hostIPList = getLocalhostAddress();

if (config.connect.listenInaddrAny) {
    for (const ip of hostIPList) {
        logger.info(`🔗 Network: 👉 http://${ip}:${port}`);
    }
}

logger.info(`⚙ Config: 👉 ${JSON.stringify(config, null, 2)}`);

const server = serve({
    fetch: app.fetch,
    hostname: config.connect.listenInaddrAny ? '::' : '127.0.0.1',
    port
});

export default server;
