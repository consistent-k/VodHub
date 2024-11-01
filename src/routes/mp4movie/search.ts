import { load } from 'cheerio';
import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { SearchData, SearchRoute } from '@/types';
import { formatStrByReg } from '@/utils/format';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`正在搜索 - ${namespace.name} - ${JSON.stringify(body)}`);

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

        let searchData: SearchData[] = [];
        let vodElements = $($('[id="list_all"]').find('ul')).find('li');
        for (const vodElement of vodElements) {
            let vodShort: SearchData = {
                vod_id: $(vodElement).find('a')[0].attribs.href,
                vod_name: formatStrByReg(/《(.*?)》/, $($($(vodElement).find('[class="text_info"]')).find('a')[0]).text()),
                vod_pic: $(vodElement).find('img')[0].attribs['data-original'],
                vod_remarks: $($(vodElement).find('[class="update_time"]')).text()
            };
            searchData.push(vodShort);
        }

        if (searchData.length > 0) {
            return {
                code: SUCCESS_CODE,
                data: searchData
            };
        }

        logger.error(`关键词搜索失败 - ${namespace.name}`);
        return {
            code: ERROR_CODE,
            message: '搜索失败',
            data: []
        };
    } catch (error) {
        logger.error(`关键词搜索失败 - ${namespace.name} - ${error}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: '搜索失败',
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
