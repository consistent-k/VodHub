import { Context } from 'hono';
import { forEach } from 'lodash';

import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { HOME_VOD_MESSAGE } from '@/constant/message';
import { HomeVodData, HomeVodRoute } from '@/types';
import { filterHomeVodData } from '@/utils/filters';
import logger from '@/utils/logger';

// 源头的最近更新数据
interface HomeVodDataOrigin {
    title: string;
    video: Array<{
        id: number;
        title: string;
        score: string;
        finished: number;
        shared: number;
        is_look: number;
        standbytime: number;
        definition: number;
        need_gold_vip: number;
        playlist_length: number;
        playlist: {
            title: string;
        };
        path: string; // 图片地址
    }>;
}

const handler = async (ctx: Context) => {
    try {
        logger.info(`${HOME_VOD_MESSAGE.INFO} - ${namespace.name}`);
        const res = await request.get<HomeVodDataOrigin[]>(`${namespace.url}/api/tag/hand`, {
            params: {
                code: 'unknown601193cf375db73d',
                channel: 'wandoujia'
            }
        });

        const { data, code } = res;

        if (code === 1) {
            let vod_list: HomeVodData[] = [];
            forEach(data, (item) => {
                item.video.forEach((videoItem) => {
                    vod_list.push({
                        vod_id: videoItem.id,
                        vod_pic: videoItem.path,
                        vod_pic_thumb: videoItem.path,
                        vod_name: videoItem.title,
                        vod_remarks: videoItem.playlist.title,
                        type_id: '0',
                        type_name: '推荐'
                    });
                });
            });
            return {
                code: SUCCESS_CODE,
                message: HOME_VOD_MESSAGE.SUCCESS,
                data: filterHomeVodData(vod_list)
            };
        }

        logger.error(`${HOME_VOD_MESSAGE.ERROR} - ${namespace.name} - ${JSON.stringify(res)}`);
        return {
            code: ERROR_CODE,
            message: HOME_VOD_MESSAGE.ERROR,
            data: []
        };
    } catch (error) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        logger.error(`${HOME_VOD_MESSAGE.ERROR} - ${namespace.name} - ${error}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: HOME_VOD_MESSAGE.ERROR,
            data: []
        };
    }
};

export const route: HomeVodRoute = {
    path: '/homeVod',
    name: 'homeVod',
    example: '/jianpian/homeVod',
    description: `最近更新`,
    handler
};
