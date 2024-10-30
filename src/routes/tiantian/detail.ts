import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { DetailData, DetailRoute } from '@/types';
import { formatVodContent } from '@/utils/format';
import logger from '@/utils/logger';

export interface VodPlayList {
    pic: string;
    sid: number;
    referer: string;
    ua: string;
    flag: number;
    title: string;
    name: string;
    sort: number;
    parse_urls: string[];
    urls: Array<{
        name: string;
        url: string;
        nid: number;
        form: string;
    }>;
}

// 源头详情数据
interface DetailDataOrigin {
    type_id: number;
    update_info: string;
    vod_id: number;
    vod_name: string;
    vod_class: string;
    vod_pic: string;
    vod_pic_thumb: string;
    vod_actor: string;
    vod_director: string;
    vod_remarks: string;
    vod_area: string;
    vod_lang: string;
    vod_year: string;
    vod_hits: number;
    vod_score: string;
    vod_content: string;
    comment_num: number;
    vod_blurb: string;
    vod_play_list: VodPlayList[];
}

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`正在获取详情 - ${namespace.name} - ${JSON.stringify(body)}`);

        const { id } = body;

        const res = await request.post<DetailDataOrigin>(`${namespace.url}/v2/home/vod_details`, {
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
            vod_play_list: data.vod_play_list.map((item) => {
                return {
                    name: item.name,
                    title: item.title,
                    urls: item.urls.map((url) => {
                        return {
                            name: url.name,
                            url: url.url
                        };
                    }),
                    parse_urls: item.parse_urls
                };
            })
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
