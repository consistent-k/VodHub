import axios from 'axios';

import logger from '../logger';

const request = axios.create();

request.interceptors.request.use((config) => {
    const { url, method } = config;
    logger.info(`request: ${method} ${url}`);
    return config;
});

request.interceptors.response.use((response) => {
    return response;
});

export default request;
