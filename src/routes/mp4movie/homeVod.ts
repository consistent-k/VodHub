import { namespace } from './namespace';
import request from './request';

import { HomeVodData, HomeVodRoute } from '@/types';
import logger from '@/utils/logger';

const handler = async () => {
    try {
        logger.info(`正在获取最近更新 - ${namespace.name}`);
        let $ = await request.getHtml(`${namespace.url}/`);

        let vod_list: HomeVodData[] = [];
        let vodElements = $('[class="index_today cclear"]').find('a');
        for (const vodElement of vodElements) {
            let vodShort: HomeVodData = {
                vod_name: vodElement.attribs.title,
                vod_id: vodElement.attribs.href,
                vod_pic: '',
                vod_remarks: ''
            };
            vod_list.push(vodShort);
        }

        if (vod_list.length > 0) {
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
    example: '/mp4movie/homeVod',
    description: `最近更新`,
    handler
};
