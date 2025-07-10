import KeyvRedis from '@keyv/redis';
import { createCache } from 'cache-manager';
import { CacheableMemory } from 'cacheable';
import { Keyv } from 'keyv';

import { config } from '@/config';

const cache = createCache({
    stores: [
        new Keyv({
            store: new CacheableMemory({ lruSize: 5000 })
        }),
        // Redis Store (conditional)
        ...(config.cache.redis
            ? [
                  new Keyv({
                      store: new KeyvRedis(config.cache.redis)
                  })
              ]
            : [])
    ],
    ttl: config.cache.ttl,
    nonBlocking: true
});

export default cache;
