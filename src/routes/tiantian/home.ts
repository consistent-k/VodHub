import { namespace } from './namespace';
import request from './request';

import { HomeRoute } from '@/types';
import logger from '@/utils/logger';

const handler = async () => {
    logger.info(`正在获取首页分类列表 - ${namespace.name}`);
    const res = await request(`${namespace.url}/v2/type/top_type`, 'post');
    const {
        data: { list },
        code
    } = res;

    if (code === 1) {
        return {
            code: 0,
            data: list
        };
    }

    logger.error(`获取首页分类列表失败 - ${namespace.name}`, JSON.stringify(res));
    return {
        code: -1,
        data: []
    };
};

export const route: HomeRoute = {
    path: '/home',
    name: 'home',
    example: '/tiantian/home',
    description: `首页分类列表`,
    handler
};
