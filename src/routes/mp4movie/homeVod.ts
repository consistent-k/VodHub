import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { HOME_VOD_MESSAGE } from '@/constant/message';
import { HomeVodData, HomeVodRoute } from '@/types';
import { formatStrByReg } from '@/utils/format';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    try {
        logger.info(`${HOME_VOD_MESSAGE.INFO} - ${namespace.name}`);
        let $ = await request.getHtml(`${namespace.url}/`);

        const typeNameMap: Record<string, string> = {
            最新电影下载: '电影',
            最新电视剧下载: '电视剧',
            外语片: '外语片',
            国语片: '国语片',
            经典电影: '经典电影',
            动画片: '动漫',
            国产剧: '电视剧',
            港台剧: '港台剧',
            日韩剧: '日韩剧',
            欧美剧: '欧美剧',
            纪录片: '纪录片'
        };

        let vod_list: HomeVodData[] = [];
        let vodElements = $('.list-group').filter((_i, el) => {
            return !!$(el).prop('id');
        });
        for (const vodElement of vodElements) {
            const vodItem = $(vodElement).find('#heading-text');
            const typeText: string = $(vodItem).text();
            const listGroup = $(vodElement).find('.list-group-item');
            for (const item of listGroup) {
                const vodA = $(item).find('a');
                const vod_name = formatStrByReg(/《(.*?)》/, $(vodA).text());
                const vod_remarks = $(vodA).text().split('》')[1];
                const type_name = typeNameMap[typeText];
                if (vodA[0] && vod_name.length > 0 && type_name) {
                    let vodShort: HomeVodData = {
                        vod_name,
                        vod_id: vodA[0].attribs.href,
                        vod_pic: '',
                        vod_pic_thumb: '',
                        vod_remarks,
                        type_name,
                        type_id: ''
                    };
                    vod_list.push(vodShort);
                }
            }
        }
        if (vod_list.length > 0) {
            return {
                code: SUCCESS_CODE,
                message: HOME_VOD_MESSAGE.SUCCESS,
                data: vod_list
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
