import { namespace } from './namespace';
import request from './request';

import { HomeData, HomeRoute } from '@/types';
import logger from '@/utils/logger';

// 源头的首页数据
interface HomeDataOrigin {
    list: Array<{
        type_id: number;
        type_name: string;
        extend: string[];
        area: string[];
        lang: string[];
        year: string[];
    }>;
}

const handler = async () => {
    try {
        logger.info(`正在获取首页分类列表 - ${namespace.name}`);
        const res = await request.post<HomeDataOrigin>(`${namespace.url}/v2/type/top_type`);

        const { data, code } = res;

        const newList: HomeData[] = data.list.map((item) => {
            return {
                type_id: item.type_id,
                type_name: item.type_name,
                extend: item.extend,
                area: item.area,
                lang: item.lang,
                year: item.year
            };
        });

        if (code === 1) {
            return {
                code: 0,
                data: newList
            };
        }

        logger.error(`获取首页分类列表失败 - ${namespace.name} - ${JSON.stringify(res)}`);
        return {
            code: -1,
            data: []
        };
    } catch (error) {
        logger.error(`获取首页分类列表失败 - ${namespace.name} - ${error}`);
        return {
            code: -1,
            data: []
        };
    }
};

export const route: HomeRoute = {
    path: '/home',
    name: 'home',
    example: '/tiantian/home',
    description: `首页分类列表`,
    handler
};
