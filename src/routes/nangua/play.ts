import { Context } from 'hono';

import { namespace } from './namespace';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { PlayRoute } from '@/types';
import logger from '@/utils/logger';
import request from '@/utils/request';

interface PlayDataOrigin {
    code: number;
    url: string;
    type: string;
}

const handler = async (ctx: Context) => {
    ctx.res.headers.set('Cache-Control', 'no-cache');
    try {
        const body = await ctx.req.json();
        logger.info(`正在获取详情 - ${namespace.name} - ${JSON.stringify(body)}`);

        const { url } = body;
        let play_type = '';
        let play_url = '';

        if (url.indexOf('m3u8') !== -1) {
            play_url = url.split('url=')[1];
            play_type = 'hls';
        } else if (url.indexOf(',') !== -1) {
            let mjurl = url.split(',')[1];
            const res = await request.post<unknown, PlayDataOrigin>(
                `${mjurl}`,
                {},
                {
                    timeout: 4000
                }
            );
            play_url = res.url || '';
            play_type = 'hls';
        } else {
            const res = await request.post<unknown, PlayDataOrigin>(
                `${url}`,
                {},
                {
                    timeout: 4000
                }
            );
            play_url = res.url || '';
            play_type = 'hls';
        }

        if (play_url.length > 0) {
            return {
                code: SUCCESS_CODE,
                data: [
                    {
                        play_type,
                        play_url
                    }
                ]
            };
        }
        logger.error(`获取播放地址失败 - ${namespace.name}`);
        return {
            code: ERROR_CODE,
            message: '获取播放地址失败',
            data: []
        };
    } catch (error) {
        logger.error(`获取播放地址失败 - ${namespace.name} - ${error}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: '获取播放地址失败',
            data: []
        };
    }
};

export const route: PlayRoute = {
    path: '/play',
    name: 'play',
    example: '/nangua/play',
    description: `获取播放地址`,
    handler,
    method: 'POST'
};
