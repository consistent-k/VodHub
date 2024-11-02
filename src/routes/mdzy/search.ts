import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';
import { DetailListData } from './type';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { SEARCH_MESSAGE } from '@/constant/message';
import { SearchData, SearchRoute } from '@/types';
import logger from '@/utils/logger';

// 源头的关键词搜索数据
interface SearchDataOrigin {
    list: DetailListData[];
}
const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`${SEARCH_MESSAGE.INFO} - ${namespace.name} - ${JSON.stringify(body)}`);

        const { keyword } = body;

        const res = await request.post<SearchDataOrigin>(`${namespace.url}/api.php/provide/vod`, {
            params: {
                ac: 'detail',
                wd: keyword
            }
        });

        const { list, code } = res;

        if (code === 1) {
            const newList: SearchData[] = list.map((item) => {
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
    example: '/mdzy/search',
    description: `关键词搜索`,
    handler,
    method: 'POST'
};
