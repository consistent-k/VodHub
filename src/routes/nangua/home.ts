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
        const newList: HomeData[] = [];

        res.forEach((item) => {
            if (item.name !== '精选') {
                const home_data: HomeData = {
                    type_id: item.id,
                    type_name: item.name,
                    filters: []
                };
                item.msg.forEach((msg) => {
                    if (msg.name === 'type') {
                        home_data.filters.push({
                            type: 'class',
                            children: msg.data
                                .filter((fItem) => fItem !== '类型')
                                .map((mItem) => {
                                    return {
                                        label: mItem,
                                        value: mItem
                                    };
                                })
                        });
                    }
                    if (msg.name === 'area') {
                        home_data.filters.push({
                            type: 'area',
                            children: msg.data
                                .filter((fItem) => fItem !== '地区')
                                .map((mItem) => {
                                    return {
                                        label: mItem,
                                        value: mItem
                                    };
                                })
                        });
                    }
                    if (msg.name === 'year') {
                        home_data.filters.push({
                            type: 'year',
                            children: msg.data
                                .filter((fItem) => fItem !== '年份')
                                .map((mItem) => {
                                    return {
                                        label: mItem,
                                        value: mItem
                                    };
                                })
                        });
                    }
                    if (msg.name === 'order') {
                        home_data.filters.push({
                            type: 'order',
                            children: msg.data
                                .filter((fItem) => fItem !== '排序')
                                .map((mItem) => {
                                    return {
                                        label: mItem,
                                        value: mItem
                                    };
                                })
                        });
                    }
                });
                newList.push(home_data);
            }
        });

        if (newList.length > 0) {
            return {
                code: SUCCESS_CODE,
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
    example: '/nangua/home',
    description: `首页分类列表`,
    handler
};
