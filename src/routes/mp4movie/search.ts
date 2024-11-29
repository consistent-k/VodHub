import { load } from 'cheerio';
import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { SEARCH_MESSAGE } from '@/constant/message';
import { SearchData, SearchRoute } from '@/types';
import { filterSearchData } from '@/utils/filters';
import { formatStrByReg } from '@/utils/format';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`${SEARCH_MESSAGE.INFO} - ${namespace.name} - ${JSON.stringify(body)}`);

        const { page, keyword } = body;

        let params = { wd: keyword, p: page, t: 'j/tNgwBS2e8O4x9TuIkYuQ==' };
        let html = await request.post(`${namespace.url}/search/`, {
            data: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Cookie: 'Hm_lvt_d8c8eecfb13fe991855f511a6e30c3d2=1708243467,1708325624,1708326536;Hm_lpvt_d8c8eecfb13fe991855f511a6e30c3d2;1708326536'
            }
        });

        // @ts-ignore
        let $ = load(html);

        let newList: SearchData[] = [];
        let vodElements = $($('[id="list_all"]').find('ul')).find('li');
        for (const vodElement of vodElements) {
            let vodShort: SearchData = {
                type_id: '0',
                type_name: '未知',
                vod_id: $(vodElement).find('a')[0].attribs.href,
                vod_name: formatStrByReg(/《(.*?)》/, $($($(vodElement).find('[class="text_info"]')).find('a')[0]).text()),
                vod_pic: $(vodElement).find('img')[0].attribs['data-original'],
                vod_remarks: $($(vodElement).find('[class="update_time"]')).text()
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
    example: '/mp4movie/search',
    description: `关键词搜索`,
    handler,
    method: 'POST'
};
