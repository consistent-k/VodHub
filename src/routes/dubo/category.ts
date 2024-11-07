import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { CATEGORY_MESSAGE } from '@/constant/message';
import { CategoryRoute } from '@/types';
import logger from '@/utils/logger';

// 源头的分类列表数据
interface CategoryDataOrigin {
    list: Array<{
        vod_id: number;
        vod_pic: string;
        vod_pic_thumb: string;
        vod_name: string;
        vod_remarks: string;
        type_id: number;
        tag: string;
    }>;
}

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`${CATEGORY_MESSAGE.INFO} - ${namespace.name} - ${JSON.stringify(body)}`);

        const { id, page, filters } = body;
        // filters: { class, area, lang, year }

        const res = await request.post<CategoryDataOrigin>(`${namespace.url}/v2/home/type_search`, {
            data: {
                limit: 12,
                type_id: id,
                page: page,
                ...filters
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
                message: CATEGORY_MESSAGE.SUCCESS,
                data: newList
            };
        }

        logger.error(`${CATEGORY_MESSAGE.ERROR} - ${namespace.name} - ${JSON.stringify(res)}`);
        return {
            code: ERROR_CODE,
            message: CATEGORY_MESSAGE.ERROR,
            data: []
        };
    } catch (error) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        logger.error(`${CATEGORY_MESSAGE.ERROR} - ${namespace.name} - ${error}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: CATEGORY_MESSAGE.ERROR,
            data: []
        };
    }
};

export const route: CategoryRoute = {
    path: '/category',
    name: 'category',
    example: '/dubo/category',
    description: `获取分类列表`,
    handler,
    method: 'POST'
};
