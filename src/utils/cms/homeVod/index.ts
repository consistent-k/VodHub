import { Context } from 'hono';

import request from '../request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { HOME_VOD_MESSAGE } from '@/constant/message';
import { USER_AGENT_CHROME } from '@/constant/userAgent';
import { HomeVodData } from '@/types';
import { CMSDetailData } from '@/types/cms';
import { filterHomeVodData } from '@/utils/filters';
import logger from '@/utils/logger';

export const handler = async (ctx: Context, namespace) => {
    try {
        logger.info(`${HOME_VOD_MESSAGE.INFO} - ${namespace.name}`);
        let res = await request.get<CMSDetailData>(`${namespace.url}/api.php/provide/vod`, {
            params: {
                ac: 'detail',
                t: '0',
                pagesize: 30
            },
            headers: {
                'User-Agent': USER_AGENT_CHROME,
                Referer: `${namespace.url}/`
            }
        });

        const { code, list } = res;

        if (code === 1) {
            let vod_list: HomeVodData[] = [];
            list.forEach((item) => {
                vod_list.push({
                    vod_id: item.vod_id,
                    vod_name: item.vod_name,
                    vod_pic: item.vod_pic,
                    vod_pic_thumb: item.vod_pic_thumb,
                    vod_remarks: item.vod_remarks,
                    type_id: item.type_id,
                    type_name: item.type_name
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
