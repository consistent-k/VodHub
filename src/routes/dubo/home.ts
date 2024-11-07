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
        type_id: number;
        type_name: string;
        extend: string[];
        area: string[];
        lang: string[];
        year: string[];
    }>;
}

const handler = async (ctx: Context) => {
    try {
        logger.info(`${HOME_MESSAGE.INFO} - ${namespace.name}`);
        const res = await request.post<HomeDataOrigin>(`${namespace.url}/v2/type/top_type`);

        const { data, code } = res;

        if (code === 1 && data?.list) {
            const newList: HomeData[] = [];

            data.list.forEach((item) => {
                const home_data: HomeData = {
                    type_id: item.type_id,
                    type_name: item.type_name,
                    filters: []
                };

                if (item.extend.length > 0) {
                    home_data.filters.push({
                        type: 'class',
                        children: item.extend
                            .filter((item) => item)
                            .map((extend) => {
                                return {
                                    label: extend,
                                    value: extend
                                };
                            })
                    });
                }

                if (item.area.length > 0) {
                    home_data.filters.push({
                        type: 'area',
                        children: item.area
                            .filter((item) => item)
                            .map((area) => {
                                return {
                                    label: area,
                                    value: area
                                };
                            })
                    });
                }

                if (item.lang.length > 0) {
                    home_data.filters.push({
                        type: 'lang',
                        children: item.lang
                            .filter((item) => item)
                            .map((lang) => {
                                return {
                                    label: lang,
                                    value: lang
                                };
                            })
                    });
                }

                if (item.year.length > 0) {
                    home_data.filters.push({
                        type: 'year',
                        children: item.year
                            .filter((item) => item)
                            .map((year) => {
                                return {
                                    label: year,
                                    value: year
                                };
                            })
                    });
                }

                newList.push(home_data);
            });

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
    example: '/dubo/home',
    description: `首页分类列表`,
    handler
};
