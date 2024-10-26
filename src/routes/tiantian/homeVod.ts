import { forEach } from 'lodash';

import { namespace } from './namespace';
import request from './request';

import { HomeVodRoute } from '@/types';
import logger from '@/utils/logger';

const handler = async () => {
    logger.info(`正在获取最近更新 - ${namespace.name}`);
    const res = await request(`${namespace.url}/v2/type/tj_vod`, 'post');
    const {
        data: { type_vod },
        code
    } = res;

    if (code === 1) {
        let vod_list: any[] = [];
        forEach(type_vod, (item) => {
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

    logger.error(`获取最近更新失败 - ${namespace.name}`, JSON.stringify(res));

    return {
        code: -1,
        data: []
    };
};

export const route: HomeVodRoute = {
    path: '/homeVod',
    name: 'homeVod',
    example: '/tiantian/homeVod',
    description: `最近更新`,
    handler
};
