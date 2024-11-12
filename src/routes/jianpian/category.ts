import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { CATEGORY_MESSAGE } from '@/constant/message';
import { CategoryRoute, CategoryVodData } from '@/types';
import logger from '@/utils/logger';

// 源头的分类列表数据
interface CategoryDataOrigin {
    id: number;
    title: string;
    score: string;
    finished: number;
    shared: number;
    is_look: number;
    standbytime: number;
    definition: number;
    need_gold_vip: number;
    playlist_length: number;
    playlist: {
        title: string;
    };
    path: string; // 图片地址
    tvimg: string; // 图片地址
    cate_id: number;
}

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`${CATEGORY_MESSAGE.INFO} - ${namespace.name} - ${JSON.stringify(body)}`);

        const { id, page, filters = {} } = body;
        // filters: { class, area, lang, year, order }

        const res = await request.get<CategoryDataOrigin[]>(`${namespace.url}/api/crumb/list`, {
            params: {
                category_id: id,
                page: page,
                limit: 12,
                area: filters.area || '',
                type: filters.class || '0',
                sort: filters.order || 'hot',
                year: filters.year || '0'
            }
        });

        const { data, code } = res;

        if (code === 1) {
            const newList: CategoryVodData[] = data.map((item) => {
                return {
                    vod_id: item.id,
                    vod_name: item.title,
                    vod_pic: item.path,
                    vod_remarks: item.playlist.title
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
    example: '/jianpian/category',
    description: `获取分类列表`,
    handler,
    method: 'POST'
};
