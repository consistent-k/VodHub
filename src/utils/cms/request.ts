import axios, { AxiosRequestConfig } from 'axios';
import { merge } from 'lodash';

const request = axios.create({});

request.interceptors.request.use((config) => {
    return config;
});

request.interceptors.response.use(async (response) => {
    return response.data;
});

export interface CMSResponse {
    code: number;
    msg: string;
    page: number;
    pagecount: number;
    limit: string;
    total: string;
}

const newRequest = {
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<CMSResponse & T> {
        return await request(url, merge({}, config, { method: 'get' }));
    },

    async post<T>(url: string, config?: AxiosRequestConfig): Promise<CMSResponse & T> {
        return await request(url, merge({}, config, { method: 'post' }));
    }
};

export default newRequest;
