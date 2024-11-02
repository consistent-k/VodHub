import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { HOME_MESSAGE } from '@/constant/message';
import { HomeData, HomeRoute } from '@/types';
import logger from '@/utils/logger';

// 源头的首页数据
interface HomeDataOrigin {
    id: number;
    name: string;
    msg: Array<{
        name: 'order' | 'type' | 'area' | 'year';
        data: string[];
    }>;
}

const handler = async (ctx) => {
    try {
        logger.info(`${HOME_MESSAGE.INFO} - ${namespace.name}`);
        const res = await request.post<HomeDataOrigin[]>(`${namespace.url}/api.php/provide/home_nav`);
        const home_data: HomeData[] = [];
        res.forEach((item) => {
            if (item.name !== '精选') {
                const newData: HomeData = {
                    type_id: item.id,
                    type_name: item.name,
                    lang: [],
                    extend: item.msg.find((msg) => msg.name === 'type')?.data.filter((fItem) => fItem !== '类型') || [],
                    area: item.msg.find((msg) => msg.name === 'area')?.data.filter((fItem) => fItem !== '地区') || [],
                    year: item.msg.find((msg) => msg.name === 'year')?.data.filter((fItem) => fItem !== '年份') || []
                };
                home_data.push(newData);
            }
        });

        if (home_data.length > 0) {
            return {
                code: SUCCESS_CODE,
                data: home_data
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
    example: '/nangua/home',
    description: `首页分类列表`,
    handler
};
