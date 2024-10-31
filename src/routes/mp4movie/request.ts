import axios, { AxiosRequestConfig } from 'axios';
import { CheerioAPI, load } from 'cheerio';
import { merge } from 'lodash';

import { namespace } from './namespace';

const request = axios.create({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
        Referer: `${namespace.url}`
    }
});

request.interceptors.request.use(async (config) => {
    return config;
});

request.interceptors.response.use(async (response) => {
    return response.data;
});

const newRequest = {
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return await request(url, merge({}, config, { method: 'get' }));
    },

    async post<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return await request(url, merge({}, config, { method: 'post' }));
    },

    async getHtml(url: string): Promise<CheerioAPI> {
        let res = await this.get(url);
        // @ts-ignore
        return Promise.resolve(load(res));
    }
};

export default newRequest;
