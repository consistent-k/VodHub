import { Context } from 'hono';

import { namespace } from './namespace';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { PlayRoute } from '@/types';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    ctx.res.headers.set('Cache-Control', 'no-cache');
    try {
        const body = await ctx.req.json();
        logger.info(`正在获取播放地址 - ${namespace.name} - ${JSON.stringify(body)}`);

        const { url } = body;

        if (url.length > 0) {
            return {
                code: SUCCESS_CODE,
                data: [
                    {
                        play_type: 'hls',
                        play_url: url
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
    example: '/mdzy/play',
    description: `获取播放地址`,
    handler,
    method: 'POST'
};
