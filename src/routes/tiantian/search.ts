import { Context } from 'hono';

import { VodPlayList } from './detail';
import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { SEARCH_MESSAGE } from '@/constant/message';
import { SearchRoute } from '@/types';
import logger from '@/utils/logger';

// 源头的关键词搜索数据
interface SearchDataOrigin {
    list: Array<{
        vod_id: number;
        vod_pic: string;
        vod_name: string;
        vod_remarks: string;
        vod_class: string;
        vod_area: string;
        vod_lang: string;
        vod_year: string;
        vod_actor: string;
        type_id: number;
        tag: string;
        type_name: string;
        vod_play_list: VodPlayList[];
    }>;
}

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`${SEARCH_MESSAGE.INFO} - ${namespace.name} - ${JSON.stringify(body)}`);

        const { page, keyword } = body;

        const res = await request.post<SearchDataOrigin>(`${namespace.url}/v2/home/search`, {
            data: {
                keyword: keyword,
                page,
                limit: 12
            }
        });
        const { data, code } = res;

        if (code === 1) {
            const newList = data.list.map((item) => {
                return {
                    vod_id: item.vod_id,
                    vod_name: item.vod_name,
                    vod_pic: item.vod_pic,
                    vod_remarks: item.vod_remarks
                };
            });
            return {
                code: SUCCESS_CODE,
                message: SEARCH_MESSAGE.SUCCESS,
                data: newList
            };
        }

        logger.error(`${SEARCH_MESSAGE.ERROR} - ${namespace.name} - ${JSON.stringify(res)}`);
        return {
            code: ERROR_CODE,
            message: SEARCH_MESSAGE.ERROR,
            data: []
        };
    } catch (error) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        logger.error(`${SEARCH_MESSAGE.ERROR} - ${namespace.name} - ${error}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: SEARCH_MESSAGE.ERROR,
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
