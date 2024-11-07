import { Context } from 'hono';
import { forEach } from 'lodash';

import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { HOME_VOD_MESSAGE } from '@/constant/message';
import { HomeVodData, HomeVodRoute } from '@/types';
import logger from '@/utils/logger';

// 源头的最近更新数据
interface HomeVodDataOrigin {
    cai: Array<{
        vod_id: string;
        vod_name: string;
        vod_pic: string;
        vod_pic_thumb: string;
        vod_remarks: string;
        tag: string;
    }>;
    loop: Array<{
        vod_id: string;
        vod_pic_thumb: string;
        vod_remarks: string;
        vod_name: string;
        type: number;
        advert_link: string;
        tag: string;
    }>;
    type_vod: Array<{
        type_id: number;
        type_name: string;
        vod: Array<{
            vod_id: number;
            vod_pic: string;
            vod_pic_thumb: string;
            vod_name: string;
            vod_remarks: string;
            type_id: number;
            tag: string;
        }>;
    }>;
}

const handler = async (ctx: Context) => {
    try {
        logger.info(`${HOME_VOD_MESSAGE.INFO} - ${namespace.name}`);
        const res = await request.post<HomeVodDataOrigin>(`${namespace.url}/v2/type/tj_vod`);

        const { data, code } = res;
        const typeNameMap: Record<number, string> = {
            0: '推荐',
            1: '电影',
            2: '韩剧',
            4: '日剧',
            5: '美剧',
            7: '泰剧',
            9: '台剧',
            10: '内地',
            11: '动漫',
            13: '综艺'
        };

        if (code === 1) {
            let vod_list: HomeVodData[] = [];
            forEach(data.type_vod, (item) => {
                if (item.type_name !== '广告') {
                    const newVodList: HomeVodData[] = item.vod.map((vod) => {
                        return {
                            vod_id: vod.vod_id,
                            vod_name: vod.vod_name,
                            vod_pic: vod.vod_pic,
                            vod_pic_thumb: vod.vod_pic_thumb,
                            vod_remarks: vod.vod_remarks,
                            type_id: item.type_id,
                            type_name: typeNameMap[item.type_id]
                        };
                    });
                    vod_list = [...vod_list, ...newVodList];
                }
            });
            return {
                code: SUCCESS_CODE,
                message: HOME_VOD_MESSAGE.SUCCESS,
                data: vod_list
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
    example: '/dubo/homeVod',
    description: `最近更新`,
    handler
};
