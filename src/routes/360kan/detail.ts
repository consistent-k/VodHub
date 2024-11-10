import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { DETAIL_MESSAGE } from '@/constant/message';
import { DetailData, DetailRoute, VodPlayList } from '@/types';
import logger from '@/utils/logger';

interface LinksDetail {
    act: string;
    api_id: string;
    api_video_id: string;
    cdn_h_cover: string;
    cdn_v_cover: string;
    createline: string;
    default_url: string;
    description: string;
    dir: string;
    duration: string;
    ent_id: string;
    free_upinfo: string;
    gaea_flag: string;
    h_cover: string;
    id: string;
    mini_url: string;
    pageurl: string;
    programUrl: string;
    publine: string;
    quality: string;
    site: string;
    site_source: string;
    sort: string;
    status: string;
    swf: string;
    temp_vip: boolean;
    title: string;
    total: string;
    updateline: string;
    upinfo: string;
    v_cover: string;
    wheshow: string;
}

// 源头详情数据
interface DetailDataOrigin {
    id: string | number;
    ent_id: string;
    title: string;
    description: string;
    moviecategory: string[];
    director: string[];
    pubdate: string;
    area: string[];
    actor: string[];
    cdncover: string;
    doubanscore: string;
    rank: number;
    playlinksdetail: {
        douyin: LinksDetail;
        imgo: LinksDetail;
        leshi: LinksDetail;
        qiyi: LinksDetail;
        qq: LinksDetail;
        youku: LinksDetail;
    };
    playlink_sites: string[];
    vip: boolean;
}

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`${DETAIL_MESSAGE.INFO} - ${namespace.name} - ${JSON.stringify(body)}`);

        const { id } = body;

        let tid_list = id.split('+');

        const res = await request.get<DetailDataOrigin>(`${namespace.url}/v1/detail`, {
            params: {
                cat: tid_list[1],
                id: tid_list[0]
            }
        });

        const { data, errno } = res;

        if (errno === 0) {
            const detailData: DetailData = {
                vod_id: data.id,
                vod_name: data.title,
                vod_pic: data.cdncover,
                vod_remarks: data.pubdate,
                vod_year: data.pubdate,
                vod_area: data.area.join('/'),
                vod_actor: data.actor.join('/'),
                vod_director: data.director.join('/'),
                vod_content: data.description,
                vod_play_list: []
            };

            for (const playFormat of data.playlink_sites) {
                let vodItems: VodPlayList['urls'] = [];
                let items = data.playlinksdetail[playFormat];
                let episodeUrl = items.default_url;
                let episodeName = items.quality || items.title || '默认';
                vodItems.push({
                    name: episodeName,
                    url: episodeUrl
                });

                if (vodItems.length > 0) {
                    const playlist: VodPlayList = {
                        name: playFormat,
                        urls: vodItems,
                        parse_urls: []
                    };
                    detailData.vod_play_list.push(playlist);
                }
            }

            return {
                code: SUCCESS_CODE,
                message: DETAIL_MESSAGE.SUCCESS,
                data: [detailData]
            };
        }
        logger.error(`${DETAIL_MESSAGE.ERROR} - ${namespace.name} - ${JSON.stringify(res)}`);
        return {
            code: ERROR_CODE,
            message: DETAIL_MESSAGE.ERROR,
            data: []
        };
    } catch (error) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        logger.error(`${DETAIL_MESSAGE.ERROR} - ${namespace.name} - ${error}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: DETAIL_MESSAGE.ERROR,
            data: []
        };
    }
};

export const route: DetailRoute = {
    path: '/detail',
    name: 'detail',
    example: '/360kan/detail',
    description: `获取详情`,
    handler,
    method: 'POST'
};
