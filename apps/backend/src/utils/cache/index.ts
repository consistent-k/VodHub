import KeyvRedis from '@keyv/redis';
import { createCache } from 'cache-manager';
import { CacheableMemory } from 'cacheable';
import { Keyv } from 'keyv';
import { config } from '@/config';

const memoryStore = new Keyv({
    store: new CacheableMemory({ lruSize: 5000 })
});

const redisStore = new Keyv({
    store: new KeyvRedis(config.cache.redis)
});

const cache = createCache({
    stores: [memoryStore, ...(config.cache.redis ? [redisStore] : [])],
    ttl: config.cache.ttl,
    nonBlocking: true
});

export default cache;
