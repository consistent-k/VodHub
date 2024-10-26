import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { SearchRoute } from '@/types';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    ctx.res.headers.set('Cache-Control', 'no-cache'); // 禁止缓存
    const body = await ctx.req.json();
    logger.info(`正在搜索 - ${namespace.name} - ${JSON.stringify(body)}`);

    const { page, keyword } = body;

    const param = {
        keyword: keyword,
        page,
        limit: 12
    };
    const res = await request(`${namespace.url}/v2/home/search`, 'post', param);

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

    logger.error(`关键词搜索失败 - ${namespace.name}`, JSON.stringify(res));
    return {
        code: -1,
        data: []
    };
};

export const route: SearchRoute = {
    path: '/search',
    name: 'search',
    example: '/tiantian/search',
    description: `关键词搜索`,
    handler,
    method: 'POST'
};
