import queryString from 'query-string';

import { NAN_GUA_CONFIG } from './config';
import { namespace } from './namespace';
import request from './request';

import { HomeVodData, HomeVodRoute } from '@/types';
import logger from '@/utils/logger';

const handler = async () => {
    try {
        logger.info(`正在获取最近更新 - ${namespace.name}`);

        const params = {
            app: NAN_GUA_CONFIG.app,
            devices: 'android',
            imei: NAN_GUA_CONFIG.imei,
            deviceModel: 'Subsystem for Android(TM)',
            deviceVersion: '33',
            appVersionName: '1.0.9',
            deviceScreen: '427*250',
            appVersionCode: '9',
            deviceBrand: 'Windows'
        };

        const strParams = queryString.stringify(params);

        let res = await request<any, any>(`${namespace.url}/api.php/provide/home_data?${strParams}`, {
            method: 'POST'
        });

        const { video } = res;
        let vod_list: HomeVodData[] = [];

        video.forEach((item: any) => {
            item.data.forEach((vod: any) => {
                if (vod.qingxidu) {
                    vod_list.push({
                        vod_id: vod.id,
                        vod_name: vod.name,
                        vod_pic: vod.img,
                        vod_remarks: vod.remarks || vod.msg
                    });
                }
            });
        });

        return {
            code: 0,
            data: vod_list
        };
    } catch (error) {
        logger.error(`获取最近更新失败 - ${namespace.name} - ${error}`);
        return {
            code: -1,
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
