import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { CATEGORY_MESSAGE } from '@/constant/message';
import { CategoryRoute, CategoryVodData } from '@/types';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`${CATEGORY_MESSAGE.INFO} - ${namespace.name} - ${JSON.stringify(body)}`);

        const { id, page, filters } = body;
        // filters: { class, area, lang, year }
        // to do: class
        let url = `${namespace.url}/vodshow/id/${id}`;
        if (page) {
            url += `/page/${page}`;
        }
        if (filters?.area) {
            url += `/area/${filters.area}`;
        }
        if (filters?.lang) {
            url += `/lang/${filters.lang}`;
        }
        if (filters?.year) {
            url += `/year/${filters.year}`;
        }

        let $ = await request.getHtml(url);

        let category_list: CategoryVodData[] = [];
        let items = $('.module-item');
        for (const item of items) {
            let oneA = $(item).find('.module-item-cover .module-item-pic a').first();

            let vodShort: CategoryVodData = {
                vod_id: oneA.attr('href') || '',
                vod_name: oneA.attr('title') || '',
                vod_pic: '',
                vod_remarks: $(item).find('.module-item-text').first().text()
            };
            let pic = $(item).find('.module-item-cover .module-item-pic img').first().attr('data-src') || '';
            if (pic.indexOf('img.php?url=') > 0) {
                pic = pic.split('img.php?url=')[1];
            } else if (!pic.includes('https:') && !pic.includes('http:')) {
                pic = 'https:' + pic;
            }
            vodShort.vod_pic = pic;
            if (vodShort.vod_name !== undefined) {
                category_list.push(vodShort);
            }
        }

        if (category_list.length > 0) {
            return {
                code: SUCCESS_CODE,
                message: CATEGORY_MESSAGE.SUCCESS,
                data: category_list
            };
        }

        logger.error(`${CATEGORY_MESSAGE.ERROR} - ${namespace.name}`);
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
    example: '/mp4movie/category',
    description: `获取分类列表`,
    handler,
    method: 'POST'
};
