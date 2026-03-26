import { BANNED_KEYWORDS } from '@/constant/word';
import 'dotenv/config';

export const config = {
    logger: {
        createFile: true,
        level: 'info',
        showTimestamp: true
    },
    connect: {
        port: 8888,
        listenInaddrAny: true
    },
    cache: {
        ttl: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL, 10) * 1000 : 1000 * 60,
        redis: process.env.REDIS_URL
    },
    bannedKeywords: process.env.BANNED_KEYWORDS?.split(',').filter((keyword) => keyword.trim()) || BANNED_KEYWORDS
};
