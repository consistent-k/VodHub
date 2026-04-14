import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { CATEGORY_MESSAGE } from '@/constant/message';
import { CategoryRoute, CategoryVodData } from '@/types';
import logger from '@/utils/logger';

// 源头的分类列表数据
interface CategoryDataOrigin {
    current_page: number;
    movies: Array<{
        actor: string[];
        area: string[];
        cdncover: string;
        comment: string;
        cover: string;
        description: string;
        director: string[];
        doubanscore: string;
        id: string;
        moviecategory: string[];
        payment: boolean;
        playlink_sites: string[];
        playlinks: {
            douyin: string;
            imgo: string;
            leshi: string;
            qiyi: string;
            qq: string;
            youku: string;
        };
        pubdate: string;
        score: number | string;
        title: string;
        vip: boolean;
    }>;
    total: number;
}

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`${CATEGORY_MESSAGE.INFO} - ${namespace.name} - ${JSON.stringify(body)}`);

        const { id, page, filters } = body;
        // filters: { class, area, lang, year, order }

        const res = await request.get<CategoryDataOrigin>(`${namespace.url}/v1/filter/list`, {
            params: {
                catid: id,
                rank: filters?.order || 'rankhot',
                cat: filters?.class || '',
                year: filters?.year || '',
                area: filters?.area || '',
                act: '',
                size: 35,
                pageno: page,
                callback: ''
            }
        });

        const { data, errno } = res;

        if (errno === 0) {
            const newList: CategoryVodData[] = data.movies.map((item) => {
                return {
                    vod_id: `${item.id}+${id}`,
                    vod_name: item.title,
                    vod_pic: !item.cover.startsWith('http') ? `https:${item.cover}` : item.cover,
                    vod_remarks: item.pubdate
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
    example: '/360kan/category',
    description: `获取分类列表`,
    handler,
    method: 'POST'
};
