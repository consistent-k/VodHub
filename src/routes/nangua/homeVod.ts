import queryString from 'query-string';

import { NAN_GUA_CONFIG } from './config';
import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { HOME_VOD_MESSAGE } from '@/constant/message';
import { HomeVodData, HomeVodRoute } from '@/types';
import { filterHomeVodData } from '@/utils/filters';
import logger from '@/utils/logger';

// 源头的最近更新数据
interface HomeVodDataOrigin {
    slide: {
        data: Array<{
            id: number;
            url: string | number;
            name: string;
            img: string;
            type: number;
            jumpurl: string;
        }>;
        ads: {
            type: number;
            msg: string;
            code: string | number;
        };
    };
    video: Array<{
        id: number;
        name: string;
        icon: string;
        ads: {
            type: number;
            msg: string;
            code: string | number;
        };
        style_type: number;
        style_num: number;
        vod_more: {
            name: string;
            type: number;
            url: string | number;
        };
        data: Array<{
            id: number;
            type: number;
            name: string;
            qingxidu: string;
            img: string;
            msg: string;
            score: string;
            section: number;
        }>;
    }>;
}

const handler = async (ctx) => {
    try {
        logger.info(`${HOME_VOD_MESSAGE.INFO} - ${namespace.name}`);

        const params = {
            imei: NAN_GUA_CONFIG.imei,
            app: NAN_GUA_CONFIG.app,
            appVersionName: NAN_GUA_CONFIG.version_name,
            appVersionCode: NAN_GUA_CONFIG.version_code,
            devices: 'android',
            deviceModel: 'Subsystem for Android(TM)',
            deviceVersion: '33',
            deviceScreen: '427*250',
            deviceBrand: 'Windows'
        };

        const strParams = queryString.stringify(params);

        let res = await request.post<HomeVodDataOrigin>(`${namespace.url}/api.php/provide/home_data?${strParams}`);

        const typeNameMap: Record<number, string> = {
            0: '推荐',
            1: '电影',
            2: '电视剧',
            3: '综艺',
            4: '动漫',
            46: '海外精选'
        };

        const { slide, video } = res;
        let vod_list: HomeVodData[] = [];

        slide.data.forEach((item) => {
            vod_list.push({
                vod_id: item.id,
                vod_name: item.name,
                vod_pic: item.img,
                vod_pic_thumb: item.img,
                vod_remarks: '',
                type_id: item.type,
                type_name: typeNameMap[item.type]
            });
        });

        video.forEach((item) => {
            item.data.forEach((vod) => {
                if (vod.qingxidu) {
                    vod_list.push({
                        vod_id: vod.id,
                        vod_name: vod.name,
                        vod_pic: vod.img,
                        vod_pic_thumb: vod.img,
                        vod_remarks: vod.msg,
                        type_id: item.id,
                        type_name: typeNameMap[item.id]
                    });
                }
            });
        });

        if (vod_list.length > 0) {
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
    example: '/nangua/homeVod',
    description: `最近更新`,
    handler
};
