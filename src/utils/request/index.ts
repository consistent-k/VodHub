import axios from 'axios';

import logger from '../logger';

const request = axios.create({
    headers: {
        'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
    }
});

request.interceptors.request.use((config) => {
    const { url, method } = config;
    logger.info(`request: ${method} ${url}`);
    return config;
});

request.interceptors.response.use((response) => {
    return response.data;
});

export default request;
