import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { HOME_MESSAGE } from '@/constant/message';
import { HomeData, HomeRoute } from '@/types';
import logger from '@/utils/logger';

const handler = async (ctx) => {
    try {
        logger.info(`${HOME_MESSAGE.INFO} - ${namespace.name}`);
        const home_data: HomeData[] = [];

        const extend: HomeData['extend'] = [];
        const area: HomeData['area'] = [];
        const year: HomeData['year'] = [];
        const lang: HomeData['lang'] = [];

        // 访问首页
        let $ = await request.getHtml(`${namespace.url}/`);
        let suoyinElement = $('[class="nav navbar-nav"]').find('li').slice(-1)[0];
        let suoyinUrl = $(suoyinElement).find('a')[0].attribs.href;

        // 访问分类列表
        let souyin$ = await request.getHtml(`${namespace.url}${suoyinUrl}`);
        let sortElements = souyin$('[class="sort-box"]').find('[class="sort-list"]');
        for (const sortElement of sortElements) {
            let name = $($(sortElement).find('h5')).text().replace('：', '');
            for (const ele of $(sortElement).find('a')) {
                if ($(ele).text() === '全部') {
                    continue;
                }
                switch (name) {
                    case '类型':
                        home_data.push({
                            type_id: Number(ele.attribs.data.split('-')[1]),
                            type_name: $(ele).text(),
                            lang: [],
                            extend: [],
                            area: [],
                            year: []
                        });
                        break;
                    case '标签':
                        extend.push($(ele).text());
                        break;
                    case '地区':
                        area.push($(ele).text());
                        break;
                    case '年代':
                        year.push($(ele).text());
                        break;
                    case '语言':
                        lang.push($(ele).text());
                        break;
                    default:
                        break;
                }
            }
        }
        if (home_data.length > 0) {
            return {
                code: SUCCESS_CODE,
                message: HOME_MESSAGE.SUCCESS,
                data: home_data.map((item) => {
                    return {
                        ...item,
                        extend: extend,
                        area: area,
                        year: year,
                        lang: lang
                    };
                })
            };
        }
        logger.error(`${HOME_MESSAGE.ERROR} - ${namespace.name}`);
        return {
            code: ERROR_CODE,
            message: HOME_MESSAGE.ERROR,
            data: []
        };
    } catch (error) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        logger.error(`${HOME_MESSAGE.ERROR} - ${namespace.name} - ${error}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: HOME_MESSAGE.ERROR,
            data: []
        };
    }
};

export const route: HomeRoute = {
    path: '/home',
    name: 'home',
    example: '/mp4movie/home',
    description: `首页分类列表`,
    handler
};
