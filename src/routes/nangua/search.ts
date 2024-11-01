import { Context } from 'hono';
import queryString from 'query-string';

import { NAN_GUA_CONFIG } from './config';
import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { SearchData, SearchRoute } from '@/types';
import logger from '@/utils/logger';

// 源头的关键词搜索数据
interface SearchDataOrigin {
    code: number;
    msg: string;
    data: Array<{
        id: number;
        type: number;
        video_name: string;
        qingxidu: string;
        img: string;
        director: string;
        main_actor: string;
        blurb: string;
        category: string;
    }>;
}
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

        const res = await request.post<SearchDataOrigin>(`${namespace.url}/api.php/provide/search_result_more?${strParams}`);

        const { data, code } = res;

        if (code === 1) {
            const newList: SearchData[] = data.map((item) => {
                return {
                    vod_id: item.id,
                    vod_name: item.video_name,
                    vod_pic: item.img,
                    vod_remarks: item.qingxidu
                };
            });
            return {
                code: SUCCESS_CODE,
                data: newList
            };
        }

        logger.error(`关键词搜索失败 - ${namespace.name} - ${JSON.stringify(res)}`);
        return {
            code: ERROR_CODE,
            message: '关键词搜索失败',
            data: []
        };
    } catch (error) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        logger.error(`关键词搜索失败 - ${namespace.name} - ${error}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: '关键词搜索失败',
            data: []
        };
    }
};

export const route: SearchRoute = {
    path: '/search',
    name: 'search',
    example: '/nangua/search',
    description: `关键词搜索`,
    handler,
    method: 'POST'
};
