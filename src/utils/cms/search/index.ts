import { Context } from 'hono';

import request from '../request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { SEARCH_MESSAGE } from '@/constant/message';
import { SearchData } from '@/types';
import { CMSDetailList } from '@/types/cms';
import { filterSearchData } from '@/utils/filters';
import logger from '@/utils/logger';

export const handler = async (ctx: Context, namespace) => {
    try {
        const body = await ctx.req.json();
        logger.info(`${SEARCH_MESSAGE.INFO} - ${namespace.name} - ${JSON.stringify(body)}`);

        const { keyword } = body;

        const res = await request.post<{
            list: CMSDetailList[];
        }>(`${namespace.url}/api.php/provide/vod`, {
            params: {
                ac: 'detail',
                wd: keyword
            }
        });

        const { list, code } = res;

        if (code === 1) {
            const newList: SearchData[] = list.map((item) => {
                return {
                    type_id: item.type_id,
                    type_name: item.type_name,
                    vod_id: item.vod_id,
                    vod_name: item.vod_name,
                    vod_pic: item.vod_pic,
                    vod_remarks: item.vod_remarks
                };
            });
            return {
                code: SUCCESS_CODE,
                message: SEARCH_MESSAGE.SUCCESS,
                data: filterSearchData(newList)
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
