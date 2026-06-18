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
    bannedKeywords: process.env.BANNED_KEYWORDS?.split(',').filter((keyword) => keyword.trim()) || BANNED_KEYWORDS,
    tmdb: {
        enabled: process.env.TMDB_ENABLED === 'true',
        apiToken: process.env.TMDB_API_TOKEN || '',
        baseUrl: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'
    },
    ai: {
        apiKey: process.env.LLM_API_KEY || '',
        baseURL: process.env.LLM_BASE_URL || '',
        model: process.env.LLM_MODEL || ''
    }
};
