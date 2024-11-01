import { Context } from 'hono';
import queryString from 'query-string';

import { NAN_GUA_CONFIG } from './config';
import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { DetailData, DetailRoute } from '@/types';
import logger from '@/utils/logger';

// 源头详情数据
interface DetailDataOrigin {
    code: number;
    msg: string;
    data: {
        name: string;
        year: string;
        score: string;
        hits: number;
        is_free: number;
        type: string;
        msg: string;
        need_points: number;
        img: string;
        info: string;
        isMovie: boolean;
        display_style: number;
        total_count: number;
        player_info: Array<{
            id: number;
            from: string;
            show: string;
            url_count: number;
            play_kernel: number;
            type: number;
            video_info: Array<{
                id: number;
                name: string;
                pic: string;
                url: string[];
            }>;
        }>;
        tryWatchTime: number;
        and_tryWatchTime: number;
        isCollect: boolean;
        isPurchase: boolean;
        isVip: boolean;
        likes: Array<{
            id: number;
            name: string;
            img: string;
            year: string;
            score: string;
            section: number;
        }>;
    };
}

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

        let res = await request.post<DetailDataOrigin>(`${namespace.url}/api.php/provide/vod_detail?${strParams}`);

        const { code, data } = res;

        if (code === 1) {
            const detailData: DetailData = {
                vod_id: id,
                vod_name: data.name,
                vod_pic: data.img,
                vod_remarks: `更新至: ${data.msg} / 评分: ${data.score}`,
                vod_year: data.year,
                vod_area: '',
                vod_actor: '',
                vod_director: '',
                vod_content: data.info || '',
                vod_play_list: data.player_info.map((item) => {
                    return {
                        name: item.show,
                        title: item.show,
                        urls: item.video_info.map((url) => {
                            return {
                                name: url.name,
                                url: url.url[0]
                            };
                        }),
                        parse_urls: []
                    };
                })
            };
            return {
                code: SUCCESS_CODE,
                data: [detailData]
            };
        }
        logger.error(`获取详情失败 - ${namespace.name} - ${JSON.stringify(res)}`);
        return {
            code: ERROR_CODE,
            message: '获取详情失败',
            data: []
        };
    } catch (error) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        logger.error(`获取详情失败 - ${namespace.name} - ${JSON.stringify(error)}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: '获取详情失败',
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
