import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { DetailData, DetailRoute } from '@/types';
import { formatVodContent } from '@/utils/format';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`正在获取详情 - ${namespace.name} - ${JSON.stringify(body)}`);

        const { id } = body;

        const res = await request<any, any>(`${namespace.url}/v2/home/vod_details`, {
            method: 'POST',
            data: {
                vod_id: id
            }
        });

        const { data, code } = res;
        const detailData: DetailData = {
            vod_id: data.vod_id,
            vod_name: data.vod_name,
            vod_pic: data.vod_pic,
            vod_remarks: data.vod_remarks,
            vod_year: data.vod_year,
            vod_area: data.vod_area,
            vod_actor: data.vod_actor,
            vod_director: data.vod_director,
            vod_content: formatVodContent(data.vod_content),
            vod_play_list: data.vod_play_list
        };

        if (code === 1) {
            return {
                code: 0,
                data: [detailData]
            };
        }
        logger.error(`获取详情失败 - ${namespace.name} - ${JSON.stringify(res)}`);

        return {
            code: -1,
            data: []
        };
    } catch (error) {
        logger.error(`获取详情失败 - ${namespace.name} - ${error}`);

        return {
            code: -1,
            data: []
        };
    }
};

export const route: DetailRoute = {
    path: '/detail',
    name: 'detail',
    example: '/tiantian/detail',
    description: `获取详情`,
    handler,
    method: 'POST'
};
