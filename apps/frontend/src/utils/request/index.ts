import axios, { AxiosRequestConfig } from 'axios';
import { merge } from 'lodash';

const request = axios.create();

request.interceptors.request.use((config) => {
    return config;
});

request.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export interface BaseRequestConfig extends AxiosRequestConfig {
    customPreFix?: string;
}

const transRequestConfig = (url: string, config: BaseRequestConfig) => {
    const basePath = config.customPreFix || '/api/vodhub/cms';
    config.url = `${basePath}${url}`;

    return config;
};

class BaseRequest {
    async request(url: string, config: BaseRequestConfig) {
        try {
            const newConfig = transRequestConfig(url, config);
            return await (
                await request.request({ ...newConfig })
            ).data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async get<T>(url: string, config?: BaseRequestConfig): Promise<T> {
        return await this.request(url, merge({}, config, { method: 'get' }));
    }

    async post<T>(url: string, config?: BaseRequestConfig): Promise<T> {
        return await this.request(url, merge({}, config, { method: 'post' }));
    }

    async put<T>(url: string, config?: BaseRequestConfig): Promise<T> {
        return await this.request(url, merge({}, config, { method: 'put' }));
    }

    async delete<T>(url: string, config?: BaseRequestConfig): Promise<T> {
        return await this.request(url, merge({}, config, { method: 'delete' }));
    }

    async patch<T>(url: string, config?: BaseRequestConfig): Promise<T> {
        return await this.request(url, merge({}, config, { method: 'patch' }));
    }
}

const baseRequest = new BaseRequest();

export default baseRequest;
