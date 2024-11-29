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
    comment: string;
    upinfo: string;
    doubanscore: string;
    id: string | number;
    cat: string | number;
    pv: string;
    cover: string;
    url: string;
    percent: string;
    ent_id: string;
    moviecat: string[];
    vip: boolean;
    description: string;
    pubdate: string;
}

const handler = async (ctx: Context) => {
    try {
        logger.info(`${HOME_VOD_MESSAGE.INFO} - ${namespace.name}`);
        const res = await request.get<HomeVodDataOrigin[]>(`${namespace.url}/v1/rank?cat=1`);

        // return res;

        const { data, errno } = res;
        const typeNameMap: Record<number, string> = {
            '1': '电影',
            '2': '剧集',
            '3': '综艺',
            '4': '动漫'
        };

        if (errno === 0) {
            let vod_list: HomeVodData[] = [];
            forEach(data, (item) => {
                vod_list.push({
                    vod_id: `${item.ent_id}+${item.cat}`,
                    vod_name: item.title,
                    vod_pic: !item.cover.startsWith('http') ? `https:${item.cover}` : item.cover,
                    vod_remarks: item.upinfo,
                    vod_pic_thumb: !item.cover.startsWith('http') ? `https:${item.cover}` : item.cover,
                    type_id: item.cat,
                    type_name: item.cat ? typeNameMap[item.cat] : ''
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
    example: '/360kan/homeVod',
    description: `最近更新`,
    handler
};
