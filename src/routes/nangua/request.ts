import axios, { AxiosRequestConfig } from 'axios';
import CryptoJS from 'crypto-js';
import { merge } from 'lodash';

import { NAN_GUA_CONFIG } from './config';
import { namespace } from './namespace';

const request = axios.create({
    headers: {
        version_name: NAN_GUA_CONFIG.version_name,
        version_code: NAN_GUA_CONFIG.version_code,
        package_name: 'com.app.nanguatv',
        imei: NAN_GUA_CONFIG.imei,
        'User-Agent': 'okhttp/4.6.0',
        Referer: namespace.url
    }
});

request.interceptors.request.use(async (config) => {
    let t = new Date().getTime().toString();
    config.headers['sign'] = CryptoJS.MD5(`${NAN_GUA_CONFIG.imei}#uBFszdEM0oL0JRn@${t}`).toString().toLowerCase();
    config.headers['timeMillis'] = t;
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
    }
};

export default newRequest;
