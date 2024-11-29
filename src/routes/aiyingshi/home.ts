import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { HOME_MESSAGE } from '@/constant/message';
import { HomeData, HomeRoute } from '@/types';
import { filterHomeData } from '@/utils/filters';
import logger from '@/utils/logger';

const handler = async (ctx) => {
    try {
        logger.info(`${HOME_MESSAGE.INFO} - ${namespace.name}`);
        const newList: HomeData[] = [];

        // 访问首页
        let $ = await request.getHtml(`${namespace.url}/`);

        let elements = $($('[class="nav-menu-items"]')[0]).find('li');

        for (const element of elements.slice(0, 6)) {
            let type_name = $($(element).find('span')).text();
            if (type_name !== '首页') {
                const home_data: HomeData = {
                    type_id: '',
                    type_name: '',
                    filters: []
                };
                const filterTypes = {
                    全部类型: 'class',
                    全部地区: 'area',
                    全部语言: 'lang',
                    全部时间: 'year',
                    时间排序: 'order'
                };
                home_data.type_name = type_name;
                let type_id = $(element).find('a')[0].attribs['href'].split('/').slice(-1)[0].split('.')[0];
                home_data.type_id = type_id;
                if (type_id !== '/' && type_id !== '最近更新') {
                    let type$ = await request.getHtml(`${namespace.url}/vodshow/id/${type_id}.html`);

                    let elements = type$('[class="scroll-content"]').slice(1);
                    // eslint-disable-next-line @typescript-eslint/prefer-for-of
                    for (let i = 0; i < elements.length; i++) {
                        const element = elements[i];

                        const firstLinkText = $($(element).find('a')[0]).text();
                        const filterType = filterTypes[firstLinkText];

                        if (filterType) {
                            const newFilter: HomeData['filters'][number] = {
                                type: filterType,
                                children: []
                            };

                            // eslint-disable-next-line max-depth
                            for (const ele of $(element).find('a').slice(1)) {
                                const href = $(ele).attr('href');
                                // eslint-disable-next-line max-depth
                                if (href) {
                                    newFilter.children.push({
                                        label: $(ele).text(),
                                        value: href
                                    });
                                }
                            }

                            home_data.filters.push(newFilter);
                        }
                    }
                }
                newList.push(home_data);
            }
        }
        if (newList.length > 0) {
            return {
                code: SUCCESS_CODE,
                message: HOME_MESSAGE.SUCCESS,
                data: filterHomeData(newList)
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
    example: '/aiyingshi/home',
    description: `首页分类列表`,
    handler
};
