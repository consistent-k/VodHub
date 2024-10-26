export const config = {
    noLogfiles: false,
    loggerLevel: 'info',
    isPackage: false,
    connect: {
        port: 8888
    },
    listenInaddrAny: true,
    showLoggerTimestamp: true,
    debugInfo: false,
    // cache
    cache: {
        ttl: 60000
    },
    memory: {
        max: 256
    }
};
