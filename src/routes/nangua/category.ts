import { Context } from 'hono';
import queryString from 'query-string';

import { NAN_GUA_CONFIG } from './config';
import { namespace } from './namespace';
import request from './request';

import { CategoryRoute, CategoryVodData } from '@/types';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`正在获取分类列表 - ${namespace.name} - ${JSON.stringify(body)}`);
        const { id, page, filters } = body;
        // filters: { class, area, lang, year }

        const params = {
            app: NAN_GUA_CONFIG.app,
            imei: NAN_GUA_CONFIG.imei,
            id,
            page,
            type: filters.class,
            area: filters.area,
            year: filters.year
        };

        const strParams = queryString.stringify(params);

        let res = await request<any, any>(`${namespace.url}/api.php/provide/vod_list?${strParams}`, {
            method: 'POST'
        });

        const { code, list } = res;

        if (code === 1) {
            const newList: CategoryVodData[] = list.map((item: any) => {
                return {
                    vod_id: item.id,
                    vod_name: item.name,
                    vod_pic: item.img,
                    vod_remarks: item.remarks || item.msg
                };
            });

            return {
                code: 0,
                data: newList
            };
        }
        logger.error(`获取分类列表失败 - ${namespace.name} - ${JSON.stringify(res)}`);
        return {
            code: -1,
            data: []
        };
    } catch (error) {
        logger.error(`获取分类列表失败 - ${namespace.name} - ${error}`);
        return {
            code: -1,
            data: []
        };
    }
};

export const route: CategoryRoute = {
    path: '/category',
    name: 'category',
    example: '/nangua/category',
    description: `获取分类列表`,
    handler,
    method: 'POST'
};
