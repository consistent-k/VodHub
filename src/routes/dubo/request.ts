import crypto from 'crypto';

import axios, { AxiosRequestConfig } from 'axios';
import { merge } from 'lodash';

import { USER_AGENT_CHROME } from '@/constant/userAgent';
import logger from '@/utils/logger';

const request = axios.create({
    headers: {
        'User-Agent': USER_AGENT_CHROME
    }
});

function md5(text: string) {
    return crypto.createHash('md5').update(text).digest('hex');
}

request.interceptors.request.use((config) => {
    logger.info(`Request: ${config.url}`);
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
    return config;
});

request.interceptors.response.use(async (response) => {
    return response.data;
});

export interface DuboResponse<T> {
    msg: string;
    code: number;
    data: T;
    update_time?: string;
}

const newRequest = {
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<DuboResponse<T>> {
        return await request(url, merge({}, config, { method: 'get' }));
    },

    async post<T>(url: string, config?: AxiosRequestConfig): Promise<DuboResponse<T>> {
        return await request(url, merge({}, config, { method: 'post' }));
    }
};

export default newRequest;
