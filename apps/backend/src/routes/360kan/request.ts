import axios, { AxiosRequestConfig } from 'axios';
import { merge } from 'lodash';

import { namespace } from './namespace';

import { USER_AGENT_CHROME } from '@/constant/userAgent';

const request = axios.create({
    headers: {
        'User-Agent': USER_AGENT_CHROME,
        Referer: `${namespace.url}/`
    }
});

request.interceptors.request.use((config) => {
    return config;
});

request.interceptors.response.use(async (response) => {
    return response.data;
});

export interface Kan360Response<T> {
    msg: string;
    errno: number;
    code: number;
    data: T;
    update_time?: string;
}

const newRequest = {
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<Kan360Response<T>> {
        return await request(url, merge({}, config, { method: 'get' }));
    },

    async post<T>(url: string, config?: AxiosRequestConfig): Promise<Kan360Response<T>> {
        return await request(url, merge({}, config, { method: 'post' }));
    }
};

export default newRequest;
