import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { SEARCH_MESSAGE } from '@/constant/message';
import { SearchData, SearchRoute } from '@/types';
import logger from '@/utils/logger';

// 源头的关键词搜索数据
interface SearchDataOrigin {
    id: number;
    title: string;
    score: number;
    finished: number;
    shared: number;
    is_look: number;
    standbytime: number;
    definition: number;
    episodes_count: string;
    need_gold_vip: number;
    relative_thumbnail: string;
    thumbnail: string;
    relative_tvimg: string;
    tvimg: string;
    mask: string;
    cate_id: number;
}

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`${SEARCH_MESSAGE.INFO} - ${namespace.name} - ${JSON.stringify(body)}`);

        const { page, keyword } = body;

        const res = await request.get<SearchDataOrigin[]>(`${namespace.url}/api/video/search`, {
            params: {
                key: keyword,
                page
            }
        });

        const { data, code } = res;

        if (code === 1) {
            const newList: SearchData[] = data.map((item) => {
                return {
                    vod_id: item.id,
                    vod_name: item.title,
                    vod_pic: item.thumbnail,
                    vod_remarks: item.mask
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
    example: '/jianpian/search',
    description: `关键词搜索`,
    handler,
    method: 'POST'
};
