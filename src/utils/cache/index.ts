import KeyvRedis from '@keyv/redis';
import { createCache } from 'cache-manager';
import { CacheableMemory } from 'cacheable';
import { Keyv } from 'keyv';

import { config } from '@/config';

const cache = createCache({
    stores: [
        new Keyv({
            store: new CacheableMemory({ ttl: config.cache.ttl, lruSize: 5000 })
        }),
        //  Redis Store
        new Keyv({
            store: new KeyvRedis(config.cache.redis)
        })
    ]
});

export default cache;
