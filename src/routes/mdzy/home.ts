import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { HOME_MESSAGE } from '@/constant/message';
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

const handler = async (ctx: Context) => {
    try {
        logger.info(`${HOME_MESSAGE.INFO} - ${namespace.name}`);
        let res = await request.get<HomeDataOrigin>(`${namespace.url}/api.php/provide/vod/?ac=list`);

        const { code } = res;

        const newList: HomeData[] = res.class.map((item) => {
            return {
                type_id: item.type_id,
                type_name: item.type_name,
                filters: []
            };
        });

        if (code === 1) {
            return {
                code: SUCCESS_CODE,
                message: HOME_MESSAGE.SUCCESS,
                data: newList
            };
        }

        logger.error(`${HOME_MESSAGE.ERROR} - ${namespace.name} - ${JSON.stringify(res)}`);
        return {
            code: ERROR_CODE,
            message: HOME_MESSAGE.ERROR,
            data: []
        };
    } catch (error) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        logger.error(`${HOME_MESSAGE.ERROR} - ${namespace.name} - ${error}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: HOME_MESSAGE.ERROR,
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
