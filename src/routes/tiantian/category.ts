import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { CategoryRoute } from '@/types';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    const body = await ctx.req.json();
    logger.info(`正在获取分类列表 - ${namespace.name} - ${JSON.stringify(body)}`);

    const { id, page, filters } = body;
    // filters: { class, area, lang, year }

    const limit = 12;
    const param = {
        type_id: id,
        page: page,
        limit: limit,
        ...filters
    };
    const res = await request(`${namespace.url}/v2/home/type_search`, 'post', param);

    const {
        data: { list },
        code
    } = res;

    if (code === 1) {
        const newList = list.map((item: any) => {
            return {
                vod_id: item.vod_id,
                vod_name: item.vod_name,
                vod_pic: item.vod_pic,
                vod_remarks: item.vod_remarks
            };
        });
        return {
            code: 0,
            data: newList
        };
    }

    logger.error(`获取分类列表失败 - ${namespace.name}`, JSON.stringify(res));
    return {
        code: -1,
        data: []
    };
};

export const route: CategoryRoute = {
    path: '/category',
    name: 'category',
    example: '/tiantian/category',
    description: `获取分类列表`,
    handler,
    method: 'POST'
};
