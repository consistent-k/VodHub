import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { CategoryRoute, CategoryVodData } from '@/types';
import { formatStrByReg } from '@/utils/format';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`正在获取分类列表 - ${namespace.name} - ${JSON.stringify(body)}`);

        const { id, page } = body;

        let $ = await request.getHtml(`${namespace.url}/list/${id}-${page}.html`);
        let category_list: CategoryVodData[] = [];
        let vodElements = $($('[id="list_all"]').find('ul')).find('li');
        for (const vodElement of vodElements) {
            let vodShort: CategoryVodData = {
                vod_id: $(vodElement).find('a')[0].attribs.href,
                vod_pic: $(vodElement).find('img')[0].attribs['data-original'],
                vod_remarks: $($(vodElement).find('[class="update_time"]')).text(),
                vod_name: formatStrByReg(/《(.*?)》/, $($($(vodElement).find('[class="text_info"]')).find('a')[0]).text())
            };
            category_list.push(vodShort);
        }

        if (category_list.length > 0) {
            return {
                code: SUCCESS_CODE,
                data: category_list
            };
        }

        logger.error(`获取分类列表失败 - ${namespace.name}`);

        return {
            code: ERROR_CODE,
            message: '获取分类列表失败',
            data: []
        };
    } catch (error) {
        logger.error(`获取分类列表失败 - ${namespace.name} - ${error}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: '获取分类列表失败',
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
