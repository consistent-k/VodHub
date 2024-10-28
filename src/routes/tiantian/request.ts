import crypto from 'crypto';

import request from '@/utils/request';

function md5(text: string) {
    return crypto.createHash('md5').update(text).digest('hex');
}

request.interceptors.request.use((config) => {
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const key = 'kj5649ertj84ks89r4jh8s45hf84hjfds04k';
    const sign = md5(`${key}${timestamp}`).toString();
    let defaultData = {
        sign: sign,
        timestamp: timestamp
    };
    config.data = {
        ...defaultData,
        ...config.data
    };
    console.log(config.data);
    return config;
});

request.interceptors.response.use(async (response) => {
    return response;
});

export default request;
