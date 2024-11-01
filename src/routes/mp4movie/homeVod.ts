import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { HomeVodData, HomeVodRoute } from '@/types';
import { formatStrByReg } from '@/utils/format';
import logger from '@/utils/logger';

const handler = async () => {
    try {
        logger.info(`正在获取最近更新 - ${namespace.name}`);
        let $ = await request.getHtml(`${namespace.url}/list/99-1.html`);

        let vod_list: HomeVodData[] = [];
        let vodElements = $('#list_dy').find('li');
        for (const vodElement of vodElements) {
            const vodA = $(vodElement).find('a');
            const vod_name = formatStrByReg(/《(.*?)》/, $(vodA).text());
            if (vodA[0] && vod_name.length > 0) {
                let vodShort: HomeVodData = {
                    vod_name,
                    vod_id: vodA[0].attribs.href,
                    vod_pic: '',
                    vod_pic_thumb: '',
                    vod_remarks: $(vodElement).find('span').text()
                };
                vod_list.push(vodShort);
            }
        }

        if (vod_list.length > 0) {
            return {
                code: SUCCESS_CODE,
                data: vod_list
            };
        }

        logger.error(`获取最近更新失败 - ${namespace.name}`);

        return {
            code: ERROR_CODE,
            message: '获取最近更新失败',
            data: []
        };
    } catch (error) {
        logger.error(`获取最近更新失败 - ${namespace.name} - ${error}`);

        return {
            code: SYSTEM_ERROR_CODE,
            message: '获取最近更新失败',
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
