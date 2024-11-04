import { Context } from 'hono';
import { uniqBy } from 'lodash';

import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { HOME_VOD_MESSAGE } from '@/constant/message';
import { HomeVodData, HomeVodRoute } from '@/types';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    try {
        logger.info(`${HOME_VOD_MESSAGE.INFO} - ${namespace.name}`);
        let $ = await request.getHtml(`${namespace.url}/`);

        let vod_list: HomeVodData[] = [];

        let items = $('.module-item');
        for (const item of items) {
            let oneA = $(item).find('.module-item-cover .module-item-pic a').first();
            const classType = $(item).find('.module-item-cover .module-item-caption .video-class').first();
            let vodShort: HomeVodData = {
                vod_id: oneA.attr('href') || '',
                vod_name: oneA.attr('title') || '',
                vod_remarks: $(item).find('.module-item-text').first().text(),
                vod_pic: '',
                vod_pic_thumb: '',
                type_name: classType.text(),
                type_id: ''
            };
            let pic = $(item).find('.module-item-cover .module-item-pic img').first().attr('data-src') || '';
            if (pic.indexOf('img.php?url=') > 0) {
                pic = pic.split('img.php?url=')[1];
            } else if (!pic.includes('https:') && !pic.includes('http:')) {
                pic = 'https:' + pic;
            }
            vodShort.vod_pic = pic;
            if (vodShort.vod_name) {
                vod_list.push(vodShort);
            }
        }
        if (vod_list.length > 0) {
            return {
                code: SUCCESS_CODE,
                message: HOME_VOD_MESSAGE.SUCCESS,
                data: uniqBy(vod_list, 'vod_id')
            };
        }

        logger.error(`${HOME_VOD_MESSAGE.ERROR} - ${namespace.name}`);
        return {
            code: ERROR_CODE,
            message: HOME_VOD_MESSAGE.ERROR,
            data: []
        };
    } catch (error) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        logger.error(`${HOME_VOD_MESSAGE.ERROR} - ${namespace.name} - ${error}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: HOME_VOD_MESSAGE.ERROR,
            data: []
        };
    }
};

export const route: HomeVodRoute = {
    path: '/homeVod',
    name: 'homeVod',
    example: '/mp4movie/homeVod',
    description: `最近更新`,
    handler
};
