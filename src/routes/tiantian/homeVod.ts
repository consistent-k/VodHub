import { forEach } from 'lodash';

import { namespace } from './namespace';
import request from './request';

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
        type_id: string;
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

const handler = async () => {
    try {
        logger.info(`正在获取最近更新 - ${namespace.name}`);
        const res = await request.post<HomeVodDataOrigin>(`${namespace.url}/v2/type/tj_vod`);

        // return res;
        const { data, code } = res;

        if (code === 1) {
            let vod_list: HomeVodData[] = [];
            forEach(data.type_vod, (item) => {
                if (item.type_name !== '广告') {
                    const newVodList = item.vod.map((vod) => {
                        return {
                            vod_id: vod.vod_id,
                            vod_name: vod.vod_name,
                            vod_pic: vod.vod_pic,
                            vod_remarks: vod.vod_remarks
                        };
                    });
                    vod_list = [...vod_list, ...newVodList];
                }
            });
            return {
                code: 0,
                data: vod_list
            };
        }

        logger.error(`获取最近更新失败 - ${namespace.name} - ${JSON.stringify(res)}`);

        return {
            code: -1,
            data: []
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
    example: '/tiantian/homeVod',
    description: `最近更新`,
    handler
};
