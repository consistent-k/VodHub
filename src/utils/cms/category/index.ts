import { Context } from 'hono';

import request from '../request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { CATEGORY_MESSAGE } from '@/constant/message';
import { USER_AGENT_CHROME } from '@/constant/userAgent';
import { CategoryVodData } from '@/types';
import { CMSDetailData } from '@/types/cms';
import logger from '@/utils/logger';

export const handler = async (ctx: Context, namespace) => {
    try {
        const body = await ctx.req.json();
        logger.info(`${CATEGORY_MESSAGE.INFO} - ${namespace.name} - ${JSON.stringify(body)}`);
        const { id, page, filters } = body;
        // filters: { class, area, lang, year }

        let res = await request.get<CMSDetailData>(`${namespace.url}/api.php/provide/vod`, {
            params: {
                ac: 'detail',
                t: id,
                pg: page,
                pagesize: 50,
                ...filters
            },
            headers: {
                'User-Agent': USER_AGENT_CHROME,
                Referer: `${namespace.url}/`
            }
        });

        const { code, list } = res;

        if (code === 1) {
            const newList: CategoryVodData[] = list.map((item) => {
                return {
                    vod_id: item.vod_id,
                    vod_name: item.vod_name,
                    vod_pic: item.vod_pic,
                    vod_remarks: item.vod_remarks
                };
            });

            return {
                code: SUCCESS_CODE,
                message: CATEGORY_MESSAGE.SUCCESS,
                data: newList
            };
        }
        logger.error(`${CATEGORY_MESSAGE.ERROR} - ${namespace.name} - ${JSON.stringify(res)}`);
        return {
            code: ERROR_CODE,
            message: CATEGORY_MESSAGE.ERROR,
            data: []
        };
    } catch (error) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        logger.error(`${CATEGORY_MESSAGE.ERROR} - ${namespace.name} - ${error}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: CATEGORY_MESSAGE.ERROR,
            data: []
        };
    }
};
