import crypto from 'crypto';

import axios, { AxiosRequestConfig } from 'axios';
import { merge } from 'lodash';

const request = axios.create({});

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
    config.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36';
    return config;
});

request.interceptors.response.use(async (response) => {
    return response.data;
});

export interface TianTianResponse<T> {
    msg: string;
    code: number;
    data: T;
    update_time?: string;
}

const newRequest = {
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<TianTianResponse<T>> {
        return await request(url, merge({}, config, { method: 'get' }));
    },

    async post<T>(url: string, config?: AxiosRequestConfig): Promise<TianTianResponse<T>> {
        return await request(url, merge({}, config, { method: 'post' }));
    }
};

export default newRequest;
