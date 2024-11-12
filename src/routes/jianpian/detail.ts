import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { DETAIL_MESSAGE } from '@/constant/message';
import { DetailData, DetailRoute, VodPlayList } from '@/types';
import { formatVodContent } from '@/utils/format';
import logger from '@/utils/logger';

// 源头详情数据
interface DetailDataOrigin {
    id: number;
    title: string;
    score: number;
    description: string;
    douban_id: string;
    original_name: string;
    others_name: Array<{
        value: string;
    }>;
    duration: string;
    episodes_count: string;
    episode_duration: string;
    imdb_url: string;
    year: {
        id: number;
        title: string;
    };
    area: {
        id: number;
        title: string;
    };
    shared: number;
    is_look: number;
    standbytime: number;
    definition: number;
    update_cycle: string;
    changed: number;
    finished: number;
    need_gold_vip: number;
    thumbnail: string; // 缩略图
    tvimg: string;
    languages: Array<{
        value: string;
    }>;
    release_dates: Array<{
        value: string;
    }>;
    types: Array<{
        id: number;
        name: string;
    }>;
    tags: Array<{
        id: number;
        name: string;
    }>;
    directors: Array<{
        id: number;
        name: string;
    }>;
    writers: Array<{
        id: number;
        name: string;
    }>;
    actors: Array<{
        id: number;
        name: string;
    }>;
    category: Array<{
        id: number;
        title: string;
    }>;
    playlist_shared: number;
    have_m3u8_ur: number;
    have_ftp_ur: number;
    btbo_downlist: Array<{
        id: number;
        val: string;
        title: string;
        url: string;
        need_share: number;
        m3u8_url: string;
    }>;
    xunlei_downlist: Array<{
        id: number;
        val: string;
        title: string;
        url: string;
        need_share: number;
        m3u8_url: string;
    }>;
    m3u8_downlist: Array<{
        id: number;
        val: string;
        title: string;
        url: string;
        need_share: number;
        m3u8_url: string;
    }>;
    new_ftp_list: Array<{
        id: number;
        title: string;
        url: string;
        need_share: number;
    }>;
    mask: string;
    can_urge: number;
    narrate_video_id: number;
    narrate_video_title: string;
    narrate_video_url: string;
    xid: string;
}

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`${DETAIL_MESSAGE.INFO} - ${namespace.name} - ${JSON.stringify(body)}`);

        const { id } = body;

        const res = await request.get<DetailDataOrigin>(`${namespace.url}/api/node/detail`, {
            params: {
                channel: 'wandoujia',
                token: '',
                id
            }
        });

        // return res;

        const playKeyMap = {
            btbo_downlist: 'btbo',
            xunlei_downlist: '迅雷',
            m3u8_downlist: 'm3u8',
            new_ftp_list: 'new_ftp',
            new_m3u8_list: 'new_m3u8'
        };

        const { data, code } = res;

        if (code === 1) {
            const detailData: DetailData = {
                vod_id: data.id,
                vod_year: data.year.title,
                vod_pic: `${data.thumbnail}@Referer=www.jianpianapp.com@User-Agent=jianpian-version353@JPAUTH=y261ow7kF2dtzlxh1GS9EB8nbTxNmaK/QQIAjctlKiEv`,
                vod_name: data.title,
                vod_content: formatVodContent(data.description),
                vod_area: data.area.title,
                vod_director: data.directors.map((item) => item.name).join(' / '),
                vod_actor: data.actors.map((item) => item.name).join(' / '),
                vod_remarks: `评分:${data.score}`,
                vod_play_list: []
            };

            Object.keys(playKeyMap).forEach((key) => {
                if (data[key].length > 0) {
                    let vodItems: VodPlayList['urls'] = [];
                    data[key].forEach((item) => {
                        vodItems.push({
                            name: item.title,
                            url: item.url
                        });
                    });
                    if (vodItems.length > 0) {
                        const playlist: VodPlayList = {
                            name: playKeyMap[key],
                            urls: vodItems,
                            parse_urls: []
                        };
                        detailData.vod_play_list.push(playlist);
                    }
                }
            });
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
    example: '/jianpian/detail',
    description: `获取详情`,
    handler,
    method: 'POST'
};
