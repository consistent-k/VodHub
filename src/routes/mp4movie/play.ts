import { Context } from 'hono';

import { namespace } from './namespace';

import { PlayRoute } from '@/types';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`正在获取详情 - ${namespace.name} - ${JSON.stringify(body)}`);

        const { url } = body;

        if (url.length > 0) {
            return {
                code: 0,
                data: [
                    {
                        play_type: '',
                        play_url: url
                    }
                ]
            };
        }
        logger.error(`获取播放地址失败 - ${namespace.name}`);
        return {
            code: -1,
            data: []
        };
    } catch (error) {
        logger.error(`获取播放地址失败 - ${namespace.name} - ${error}`);
        return {
            code: -1,
            data: []
        };
    }
};

export const route: PlayRoute = {
    path: '/play',
    name: 'play',
    example: '/mp4movie/play',
    description: `获取播放地址`,
    handler,
    method: 'POST'
};
