import { AxiosRequestConfig } from 'axios';
import CryptoJS from 'crypto-js';
import { merge } from 'lodash';

import { NAN_GUA_CONFIG } from './config';

import cache from '@/utils/cache';
import request from '@/utils/request';

request.interceptors.request.use(async (config) => {
    let t = new Date().getTime().toString();
    config.headers['version_name'] = '1.0.6';
    config.headers['version_code'] = '6';
    config.headers['package_name'] = 'com.app.nanguatv';
    config.headers['sign'] = CryptoJS.MD5(`${NAN_GUA_CONFIG.imei}#uBFszdEM0oL0JRn@` + t)
        .toString()
        .toLowerCase();
    config.headers['imei'] = NAN_GUA_CONFIG.imei;
    config.headers['timeMillis'] = t;
    config.headers['User-Agent'] = 'okhttp/4.6.0';
    const cacheCookie: string = (await cache.get('nangua:cookies')) || '';
    if (cacheCookie?.length > 0) {
        console.log('cacheCookie', cacheCookie);
        config.headers['Cookie'] = cacheCookie.split('&').join('; ');
    }
    return config;
});

request.interceptors.response.use(async (response) => {
    const { headers } = response;
    const resCookie = headers['set-cookie'];
    if (Array.isArray(resCookie) && resCookie.length > 0) {
        console.log('resCookie', resCookie);
        await cache.set('nangua:cookies', resCookie?.join('&') || '', 60 * 60 * 24 * 7);
    }
    return response.data;
});

const newRequest = {
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return await request(url, merge({}, config, { method: 'get' }));
    },

    async post<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return await request(url, merge({}, config, { method: 'post' }));
    }
};

export default newRequest;
