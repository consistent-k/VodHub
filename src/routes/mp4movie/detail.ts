import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { DETAIL_MESSAGE } from '@/constant/message';
import { DetailData, DetailRoute, VodPlayList } from '@/types';
import { formatStrByReg } from '@/utils/format';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`${DETAIL_MESSAGE.INFO} - ${namespace.name} - ${JSON.stringify(body)}`);

        const { id } = body;

        let $ = await request.getHtml(`${namespace.url}${id}`);

        let detailRootElement = $('[class="article-header"]');
        let detailElements = $(detailRootElement).find('p');
        let content = '';
        for (const detailElement of detailElements) {
            content = content + $(detailElement).text() + '\n';
        }

        let contentElement = $('[class="article-related info"]').find('p');

        let vodDetail: DetailData = {
            vod_id: id,
            vod_name: formatStrByReg(/名称：(.*?)\n/, content),
            vod_pic: $(detailRootElement).find('img')[0].attribs.src,
            vod_remarks: formatStrByReg(/更新：(.*?)\n/, content),
            vod_year: formatStrByReg(/年份：(.*?)\n/, content),
            vod_area: formatStrByReg(/地区：(.*?)\n/, content),
            vod_actor: formatStrByReg(/主演：(.*?)\n/, content),
            vod_director: formatStrByReg(/导演：(.*?)\n/, content),
            vod_content: $(contentElement).text(),
            vod_play_list: []
        };

        let downloadElements = $('[class="article-related download_url"]');

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < downloadElements.length; i++) {
            let playFormatElement = downloadElements[i];
            const vod_play_list_item: VodPlayList = {
                name: '',
                urls: [],
                parse_urls: []
            };
            let format_name = $($(playFormatElement).find('h2')).text().replaceAll(vodDetail.vod_name, '').replaceAll('下载', '播放');
            vod_play_list_item.name = format_name;

            for (const playUrlElement of $(downloadElements[i]).find('a')) {
                let episodeName = $(playUrlElement).text().replaceAll('磁力链下载', '').replaceAll('.mp4', '');
                let episodeUrl = playUrlElement.attribs.href;
                vod_play_list_item.urls.push({
                    name: episodeName,
                    url: episodeUrl
                });
            }

            vodDetail.vod_play_list.push(vod_play_list_item);
        }

        if (vodDetail.vod_play_list.length > 0) {
            return {
                code: SUCCESS_CODE,
                message: DETAIL_MESSAGE.SUCCESS,
                data: [vodDetail]
            };
        }

        logger.error(`${DETAIL_MESSAGE.ERROR} - ${namespace.name} - ${JSON.stringify(res)}`);
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
    example: '/mp4movie/detail',
    description: `获取详情`,
    handler,
    method: 'POST'
};
