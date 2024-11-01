import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
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
        logger.info(`正在获取分类列表 - ${namespace.name} - ${JSON.stringify(body)}`);

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

        // return res;

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
                data: newList
            };
        }

        logger.error(`获取分类列表失败 - ${namespace.name} - ${JSON.stringify(res)}`);
        return {
            code: ERROR_CODE,
            message: '获取分类列表失败',
            data: []
        };
    } catch (error) {
        logger.error(`获取分类列表失败 - ${namespace.name} - ${error}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: '获取分类列表失败',
            data: []
        };
    }
};

export const route: CategoryRoute = {
    path: '/category',
    name: 'category',
    example: '/tiantian/category',
    description: `获取分类列表`,
    handler,
    method: 'POST'
};
