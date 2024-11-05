import { Context } from 'hono';
import _, { trim } from 'lodash';

import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { DETAIL_MESSAGE } from '@/constant/message';
import { DetailData, DetailRoute, VodPlayList } from '@/types';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`${DETAIL_MESSAGE.INFO} - ${namespace.name} - ${JSON.stringify(body)}`);

        const { id } = body;

        let $ = await request.getHtml(`${namespace.url}${id}`);

        let vodDetail: DetailData = {
            vod_id: id,
            vod_name: $('.page-title').text(),
            vod_pic: $('[class="video-cover"]').find('.lazyload')[0].attribs['data-src'],
            vod_remarks: '',
            vod_year: '',
            vod_area: '',
            vod_actor: '',
            vod_director: '',
            vod_content: '',
            vod_play_list: []
        };
        let video_info_list = $('.video-info-aux').text().replaceAll('\t', '').split('\n');
        let type_list: string[] = [];
        for (const video_info of video_info_list) {
            if (!_.isEmpty(video_info.replaceAll(' ', '').replaceAll('/', ''))) {
                type_list.push(video_info.replaceAll(' ', '').replaceAll('/', ''));
            }
        }
        // vodDetail.type_name = type_list.slice(0, 2).join('*');
        let video_items = $('[class="video-info-items"]');
        let vidoe_info_actor_list = $(video_items[1]).find('a');
        let actor_list: string[] = [];
        for (const vidoe_info_actor of vidoe_info_actor_list) {
            const actor = $(vidoe_info_actor).text() || '';
            actor_list.push(actor);
        }
        vodDetail.vod_actor = actor_list.join(' / ');
        vodDetail.vod_director = $(video_items[0]).find('a').text();
        vodDetail.vod_year = type_list[3];
        vodDetail.vod_area = type_list[4];
        vodDetail.vod_remarks = $(video_items[3]).find('.video-info-item').text();
        vodDetail.vod_content = $(video_items[5]).find('.video-info-item').text();
        vodDetail.vod_content = vodDetail.vod_content.replace('收起', '').replace('展开', '').replaceAll('\t', '').replaceAll('\n', '');
        vodDetail.vod_content = trim(vodDetail.vod_content);

        let playElements = $($('[class="module-tab-content"]')[0]).find('span');
        let urlElements = $('[class="module-list module-player-list tab-list sort-list "]');

        let form_list: string[] = [];
        for (const playerElement of playElements) {
            form_list.push($(playerElement).text());
        }
        let play_url_list: Array<VodPlayList['urls']> = [];
        for (const urlElement of urlElements) {
            let playUrlElements = $($(urlElement).find('[class="sort-item"]')).find('a');
            let vodItems: VodPlayList['urls'] = [];
            for (const playUrlElement of playUrlElements) {
                let name = $(playUrlElement).text();
                let url = playUrlElement.attribs['href'];
                vodItems.push({
                    name,
                    url
                });
            }
            play_url_list.push(vodItems);
        }

        form_list.forEach((form, index) => {
            let play_url_data: VodPlayList = {
                name: form,
                urls: play_url_list[index],
                parse_urls: []
            };
            vodDetail.vod_play_list.push(play_url_data);
        });

        if (vodDetail.vod_play_list.length > 0) {
            return {
                code: SUCCESS_CODE,
                message: DETAIL_MESSAGE.SUCCESS,
                data: [vodDetail]
            };
        }

        logger.error(`${DETAIL_MESSAGE.ERROR} - ${namespace.name}`);
        return {
            code: ERROR_CODE,
            message: DETAIL_MESSAGE.ERROR,
            data: []
        };
    } catch (error) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        logger.error(`${DETAIL_MESSAGE.ERROR} - ${namespace.name} - ${error}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: DETAIL_MESSAGE.ERROR,
            data: []
        };
    }
};

export const route: DetailRoute = {
    path: '/detail',
    name: 'detail',
    example: '/aiyingshi/detail',
    description: `获取详情`,
    handler,
    method: 'POST'
};
