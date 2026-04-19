import type { Context } from 'hono';

import request from '../request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { CATEGORY_MESSAGE } from '@/constant/message';
import { USER_AGENT_CHROME } from '@/constant/userAgent';
import type { CategoryVodData, Namespace } from '@/types';
import type { CMSDetailData } from '@/types/cms';
import logger from '@/utils/logger';

export const handler = async (ctx: Context, namespace: Namespace) => {
    try {
        const id = ctx.req.query('id') || '';
        const page = ctx.req.query('page') || '1';
        const categoryClass = (ctx.req.query('class') || '') as string;
        const area = ctx.req.query('area') || '';
        const lang = ctx.req.query('lang') || '';
        const year = ctx.req.query('year') || '';
        const order = ctx.req.query('order') || '';
        logger.info(`${CATEGORY_MESSAGE.INFO} - ${namespace.name} - id=${id}, page=${page}, class=${categoryClass}, area=${area}, lang=${lang}, year=${year}, order=${order}`);

        const res = await request.get<CMSDetailData>(`${namespace.url}/api.php/provide/vod`, {
            params: {
                ac: 'detail',
                t: id,
                pg: page,
                pagesize: 50,
                h: order,
                cat: categoryClass,
                area,
                lang,
                year
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
        logger.error(`${CATEGORY_MESSAGE.ERROR} - ${namespace.name} - ${error instanceof Error ? error.message : String(error)}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: CATEGORY_MESSAGE.ERROR,
            data: []
        };
    }
};
