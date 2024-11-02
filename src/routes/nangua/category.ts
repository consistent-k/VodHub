import { Context } from 'hono';
import queryString from 'query-string';

import { NAN_GUA_CONFIG } from './config';
import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { CATEGORY_MESSAGE } from '@/constant/message';
import { CategoryRoute, CategoryVodData } from '@/types';
import logger from '@/utils/logger';

// 源头的分类列表数据
interface CategoryDataOrigin {
    code: number;
    msg: string;
    page: string;
    limit: string;
    pagecount: number;
    total: number;
    list: Array<{
        id: number;
        img: string;
        name: string;
        score: string;
        msg: string;
    }>;
}

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`${CATEGORY_MESSAGE.INFO} - ${namespace.name} - ${JSON.stringify(body)}`);

        const { id, page, filters } = body;
        // filters: { class, area, lang, year }

        const params = {
            app: NAN_GUA_CONFIG.app,
            imei: NAN_GUA_CONFIG.imei,
            id,
            page,
            type: filters.class,
            area: filters.area,
            year: filters.year
        };

        const strParams = queryString.stringify(params);

        let res = await request.post<CategoryDataOrigin>(`${namespace.url}/api.php/provide/vod_list?${strParams}`);
        const { code, list } = res;

        if (code === 1) {
            const newList: CategoryVodData[] = list.map((item) => {
                return {
                    vod_id: item.id,
                    vod_name: item.name,
                    vod_pic: item.img,
                    vod_remarks: item.msg
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

export const route: CategoryRoute = {
    path: '/category',
    name: 'category',
    example: '/nangua/category',
    description: `获取分类列表`,
    handler,
    method: 'POST'
};
