import { BANNED_KEYWORDS } from '@/constant/word';
import 'dotenv/config';

export const config = {
    // 日志相关配置
    looger: {
        // 创建日志文件
        createFile: true,
        // 日志级别
        level: 'info',
        // 是否显示时间戳
        showTimestamp: true
    },
    // 服务连接配置
    connect: {
        port: 8888,
        listenInaddrAny: true
    },
    cache: {
        ttl: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL, 10) : 1000 * 60, // 默认缓存时间为60秒
        redis: process.env.REDIS_URL
    },
    // 禁用关键词
    bannedKeywords: process.env.BANNED_KEYWORDS?.split(',').filter((keyword) => keyword.trim()) || BANNED_KEYWORDS
};
