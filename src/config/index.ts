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
    // 缓存配置
    cache: {
        ttl: 60000
    }
};
