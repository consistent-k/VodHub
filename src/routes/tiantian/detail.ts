import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { DetailRoute } from '@/types';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    ctx.res.headers.set('Cache-Control', 'no-cache'); // 禁止缓存
    const body = await ctx.req.json();
    logger.info(`正在获取详情 - ${namespace.name} - ${JSON.stringify(body)}`);

    const { id } = body;
    const param = {
        vod_id: id
    };

    const res = await request(`${namespace.url}/v2/home/vod_details`, 'post', param);

    const { data, code } = res;

    if (code === 1) {
        return {
            code: 0,
            data: [
                {
                    vod_id: data.vod_id,
                    vod_name: data.vod_name,
                    vod_pic: data.vod_pic,
                    vod_remarks: data.vod_remarks,
                    vod_year: data.vod_year,
                    vod_area: data.vod_area,
                    vod_actor: data.vod_actor,
                    vod_director: data.vod_director,
                    vod_content: data.vod_content,
                    vod_play_list: data.vod_play_list
                }
            ]
        };
    }
    logger.error(`获取详情失败 - ${namespace.name} - ${JSON.stringify(res)}`);

    return {
        code: -1,
        data: []
    };
};

export const route: DetailRoute = {
    path: '/detail',
    name: 'detail',
    example: '/tiantian/detail',
    description: `获取详情`,
    handler,
    method: 'POST'
};
