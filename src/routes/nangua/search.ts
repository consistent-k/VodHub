import { Context } from 'hono';
import queryString from 'query-string';

import { NAN_GUA_CONFIG } from './config';
import { namespace } from './namespace';
import request from './request';

import { SearchData, SearchRoute } from '@/types';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`正在搜索 - ${namespace.name} - ${JSON.stringify(body)}`);

        const { page, keyword } = body;

        const params = {
            app: NAN_GUA_CONFIG.app,
            imei: NAN_GUA_CONFIG.imei,
            video_name: keyword,
            page,
            pageSize: 12,
            tid: 0
        };

        const strParams = queryString.stringify(params);

        const res = await request<any, any>(`${namespace.url}/api.php/provide/search_result_more?${strParams}`, {
            method: 'POST'
        });

        const { data, code } = res;

        if (code === 1) {
            const newList: SearchData[] = data.map((item: any) => {
                return {
                    vod_id: item.id,
                    vod_name: item.video_name,
                    vod_pic: item.img,
                    vod_remarks: item.qingxidu
                };
            });
            return {
                code: 0,
                data: newList
            };
        }

        logger.error(`关键词搜索失败 - ${namespace.name} - ${JSON.stringify(res)}`);
        return {
            code: -1,
            data: []
        };
    } catch (error) {
        logger.error(`关键词搜索失败 - ${namespace.name} - ${error}`);
        return {
            code: -1,
            data: []
        };
    }
};

export const route: SearchRoute = {
    path: '/search',
    name: 'search',
    example: '/tiantian/search',
    description: `关键词搜索`,
    handler,
    method: 'POST'
};
