import { serve } from '@hono/node-server';

import app from '@/app';
import { config } from '@/config';
import { getLocalhostAddress } from '@/utils/common-utils';
import logger from '@/utils/logger';

const port = config.connect.port;
const hostIPList = getLocalhostAddress();

if (config.listenInaddrAny) {
    for (const ip of hostIPList) {
        logger.info(`🔗 Network: 👉 http://${ip}:${port}`);
    }
}

const server = serve({
    fetch: app.fetch,
    hostname: config.listenInaddrAny ? '::' : '127.0.0.1',
    port
});

export default server;
