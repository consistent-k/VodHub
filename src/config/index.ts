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
        ttl: 60000,
        redis: process.env.REDIS_URL || 'redis://localhost:6379'
    },
    // 禁用关键词
    bannedKeywords: process.env.BANNED_KEYWORDS?.split(',').filter((keyword) => keyword.trim()) || ['福利', '伦理', '成人', '三级', '激情', '情色', '里番', '无码']
};
