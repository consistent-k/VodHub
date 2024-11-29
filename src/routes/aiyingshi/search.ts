import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { SEARCH_MESSAGE } from '@/constant/message';
import { SearchData, SearchRoute } from '@/types';
import { filterSearchData } from '@/utils/filters';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`${SEARCH_MESSAGE.INFO} - ${namespace.name} - ${JSON.stringify(body)}`);

        const { keyword } = body;

        let $ = await request.getHtml(`${namespace.url}/vodsearch/wd/${keyword}.html`);

        let newList: SearchData[] = [];
        let items = $('.module-search-item');
        for (const item of items) {
            let vodShort: SearchData = {
                type_id: $(item).find('.video-info-aux > a')[0].attribs.href,
                type_name: $(item).find('.video-info-aux > a')[0].attribs.title,
                vod_id: $(item).find('.video-serial')[0].attribs.href,
                vod_name: $(item).find('.video-serial')[0].attribs.title,
                vod_pic: $(item).find('.module-item-pic > img')[0].attribs['data-src'],
                vod_remarks: $($(item).find('.video-serial')[0]).text()
            };
            newList.push(vodShort);
        }

        if (newList.length > 0) {
            return {
                code: SUCCESS_CODE,
                message: SEARCH_MESSAGE.SUCCESS,
                data: filterSearchData(newList)
            };
        }

        logger.error(`${SEARCH_MESSAGE.ERROR} - ${namespace.name}`);
        return {
            code: ERROR_CODE,
            message: SEARCH_MESSAGE.ERROR,
            data: []
        };
    } catch (error) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        logger.error(`${SEARCH_MESSAGE.ERROR} - ${namespace.name} - ${error}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: SEARCH_MESSAGE.ERROR,
            data: []
        };
    }
};

export const route: SearchRoute = {
    path: '/search',
    name: 'search',
    example: '/aiyingshi/search',
    description: `关键词搜索`,
    handler,
    method: 'POST'
};
