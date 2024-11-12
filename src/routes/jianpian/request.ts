import axios, { AxiosRequestConfig } from 'axios';
import { merge } from 'lodash';

const request = axios.create({
    headers: {
        'User-Agent': 'jianpian-android/360',
        JPAUTH: 'y261ow7kF2dtzlxh1GS9EB8nbTxNmaK/QQIAjctlKiEv',
        Referer: 'www.jianpianapp.com'
    }
});

request.interceptors.request.use((config) => {
    return config;
});

request.interceptors.response.use(async (response) => {
    return response.data;
});

export interface JianPianResponse<T> {
    code: number;
    msg: string;
    data: T;
    update_time?: string;
}

const newRequest = {
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<JianPianResponse<T>> {
        return await request(url, merge({}, config, { method: 'get' }));
    },

    async post<T>(url: string, config?: AxiosRequestConfig): Promise<JianPianResponse<T>> {
        return await request(url, merge({}, config, { method: 'post' }));
    }
};

export default newRequest;
