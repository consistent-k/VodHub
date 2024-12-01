import { Context } from 'hono';

import request from '../request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { DETAIL_MESSAGE } from '@/constant/message';
import { USER_AGENT_CHROME } from '@/constant/userAgent';
import { DetailData, VodPlayList } from '@/types';
import { CMSDetailData } from '@/types/cms';
import { formatVodContent } from '@/utils/format';
import logger from '@/utils/logger';

function parseEpisodes(str): VodPlayList['urls'] {
    const arr = str.split('#')?.filter((item) => item);
    const episodes: VodPlayList['urls'] = [];
    arr.forEach((item) => {
        episodes.push({
            name: item.split('$')[0],
            url: item.split('$')[1]
        });
    });
    return episodes;
}

export const handler = async (ctx: Context, namespace) => {
    try {
        const body = await ctx.req.json();
        logger.info(`${DETAIL_MESSAGE.INFO} - ${namespace.name} - ${JSON.stringify(body)}`);

        const { id } = body;

        const res = await request.get<CMSDetailData>(`${namespace.url}/api.php/provide/vod`, {
            params: {
                ac: 'detail',
                ids: id
            },
            headers: {
                'User-Agent': USER_AGENT_CHROME,
                Referer: `${namespace.url}/`
            }
        });

        const { list, code } = res;

        if (code === 1 && list.length > 0) {
            const data = list[0];
            const detailData: DetailData = {
                vod_id: data.vod_id,
                vod_name: data.vod_name,
                vod_pic: data.vod_pic,
                vod_remarks: data.vod_remarks,
                vod_year: data.vod_year,
                vod_area: data.vod_area,
                vod_actor: data.vod_actor,
                vod_director: data.vod_director,
                vod_content: formatVodContent(data.vod_content),
                vod_play_list: [
                    {
                        name: data.vod_play_from,
                        urls: parseEpisodes(data.vod_play_url),
                        parse_urls: []
                    }
                ]
            };
            return {
                code: SUCCESS_CODE,
                message: DETAIL_MESSAGE.SUCCESS,
                data: [detailData]
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
