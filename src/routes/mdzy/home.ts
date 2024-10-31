import { namespace } from './namespace';
import request from './request';

import { HomeData, HomeRoute } from '@/types';
import logger from '@/utils/logger';

// 源头的首页数据
interface HomeDataOrigin {
    list: Array<{
        vod_id: number;
        vod_name: string;
        type_id: string;
        type_name: string;
        vod_en: string;
        vod_time: string;
        vod_remarks: string;
        vod_play_from: string;
    }>;
    class: Array<{
        type_id: number;
        type_pid: number;
        type_name: string;
    }>;
}

const handler = async () => {
    try {
        logger.info(`正在获取首页分类列表 - ${namespace.name}`);
        let res = await request.get<HomeDataOrigin>(`${namespace.url}/api.php/provide/vod/?ac=list`);

        const { code } = res;

        const newList: HomeData[] = res.class.map((item) => {
            return {
                type_id: item.type_id,
                type_name: item.type_name,
                extend: [],
                area: [],
                lang: [],
                year: []
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
    example: '/mdzy/home',
    description: `首页分类列表`,
    handler
};
