import { serve } from '@hono/node-server';
import { EnvHttpProxyAgent, setGlobalDispatcher } from 'undici';

import app from '@/app';
import { config } from '@/config';
import { getLocalhostAddress } from '@/utils/common-utils';
import logger from '@/utils/logger';

// Enable proxy for globalThis.fetch when HTTP_PROXY/HTTPS_PROXY is set
if (process.env.http_proxy || process.env.HTTP_PROXY || process.env.https_proxy || process.env.HTTPS_PROXY) {
    const proxyAgent = new EnvHttpProxyAgent();
    setGlobalDispatcher(proxyAgent);
}

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

const server = serve({
    fetch: app.fetch,
    hostname: config.connect.listenInaddrAny ? '::' : '127.0.0.1',
    port
});

export default server;
