import { createCache } from 'cache-manager';
import { CacheableMemory } from 'cacheable';
import { Keyv } from 'keyv';

import { config } from '@/config';

const cache = createCache({
    stores: [
        new Keyv({
            store: new CacheableMemory({ ttl: config.cache.ttl, lruSize: 5000 })
        })
    ]
});

export default cache;
