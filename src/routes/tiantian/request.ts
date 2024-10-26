import crypto from 'crypto';

import request from '@/utils/request';

function md5(text: string) {
    return crypto.createHash('md5').update(text).digest('hex');
}

const requestTT = async (url: string, method: 'post' | 'get', data?: any) => {
    const timestamp = Math.floor(new Date().getTime() / 1000);
    const key = 'kj5649ertj84ks89r4jh8s45hf84hjfds04k';
    const sign = md5(`${key}${timestamp}`).toString();
    let defaultData = {
        sign: sign,
        timestamp: timestamp
    };
    let response: any = await request(`${url}`, {
        method: method || 'get',
        data: {
            ...defaultData,
            ...data
        }
    });
    return await response;
};

export default requestTT;
