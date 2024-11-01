import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';
import { DetailListData } from './type';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { DetailData, DetailRoute, VodPlayList } from '@/types';
import { formatVodContent } from '@/utils/format';
import logger from '@/utils/logger';

// 源头详情数据
interface DetailDataOrigin {
    list: DetailListData[];
}

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

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`正在获取详情 - ${namespace.name} - ${JSON.stringify(body)}`);

        const { id } = body;

        const res = await request.get<DetailDataOrigin>(`${namespace.url}/api.php/provide/vod`, {
            params: {
                ac: 'detail',
                ids: id
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
                data: [detailData]
            };
        }

        logger.error(`获取详情失败 - ${namespace.name} - ${JSON.stringify(res)}`);

        return {
            code: ERROR_CODE,
            message: '获取详情失败',
            data: []
        };
    } catch (error) {
        logger.error(`获取详情失败 - ${namespace.name} - ${error}`);

        return {
            code: SYSTEM_ERROR_CODE,
            message: '获取详情失败',
            data: []
        };
    }
};

export const route: DetailRoute = {
    path: '/detail',
    name: 'detail',
    example: '/mdzy/detail',
    description: `获取详情`,
    handler,
    method: 'POST'
};
