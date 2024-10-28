import { Context } from 'hono';
import queryString from 'query-string';

import { NAN_GUA_CONFIG } from './config';
import { namespace } from './namespace';
import request from './request';

import { DetailData, DetailRoute } from '@/types';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`正在获取详情 - ${namespace.name} - ${JSON.stringify(body)}`);

        const { id } = body;
        const params = {
            app: NAN_GUA_CONFIG.app,
            imei: NAN_GUA_CONFIG.imei,
            id
        };

        const strParams = queryString.stringify(params);

        let res = await request<any, any>(`${namespace.url}/api.php/provide/vod_detail?${strParams}`, {
            method: 'POST'
        });

        const { code, data } = res;

        if (code === 1) {
            const detailData: DetailData = {
                vod_id: id,
                vod_name: data.name,
                vod_pic: data.img,
                vod_remarks: `更新至: ${data.msg} / 评分: ${data.score}`,
                vod_year: data.year,
                vod_area: data.area || '',
                vod_actor: data.actor || '',
                vod_director: data.director || '',
                vod_content: data.info || '',
                vod_play_list: data.player_info
            };
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
        logger.error(`获取详情失败 - ${namespace.name} - ${JSON.stringify(error)}`);
        return {
            code: -1,
            data: []
        };
    }
};

export const route: DetailRoute = {
    path: '/detail',
    name: 'detail',
    example: '/nangua/detail',
    description: `获取详情`,
    handler,
    method: 'POST'
};
