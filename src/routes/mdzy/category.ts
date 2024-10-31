import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { CategoryRoute, CategoryVodData } from '@/types';
import logger from '@/utils/logger';

// 源头的分类列表数据
interface CategoryDataOrigin {
    list: Array<{
        vod_id: number;
        vod_name: string;
        type_id: string;
        type_name: string;
        vod_en: string;
        vod_time: string;
        vod_remarks: string;
        vod_play_from: string;
    }>;
    class: Array<{
        type_id: number;
        type_pid: number;
        type_name: string;
    }>;
}

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`正在获取分类列表 - ${namespace.name} - ${JSON.stringify(body)}`);
        const { id, page, filters } = body;
        // filters: { class, area, lang, year }

        let res = await request.post<CategoryDataOrigin>(`${namespace.url}/api.php/provide/vod`, {
            params: {
                ac: 'list',
                t: id,
                pg: page,
                ...filters
            }
        });
        const { code, list } = res;

        if (code === 1) {
            const newList: CategoryVodData[] = list.map((item) => {
                return {
                    vod_id: item.vod_id,
                    vod_name: item.vod_name,
                    vod_pic: '',
                    vod_remarks: item.vod_remarks
                };
            });

            return {
                code: 0,
                data: newList
            };
        }
        logger.error(`获取分类列表失败 - ${namespace.name} - ${JSON.stringify(res)}`);
        return {
            code: -1,
            data: []
        };
    } catch (error) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        logger.error(`获取分类列表失败 - ${namespace.name} - ${error}`);
        return {
            code: -1,
            data: []
        };
    }
};

export const route: CategoryRoute = {
    path: '/category',
    name: 'category',
    example: '/mdzy/category',
    description: `获取分类列表`,
    handler,
    method: 'POST'
};
