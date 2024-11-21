import { Context } from 'hono';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { PLAY_MESSAGE } from '@/constant/message';
import logger from '@/utils/logger';

export const handler = async (ctx: Context, namespace) => {
    ctx.res.headers.set('Cache-Control', 'no-cache');
    try {
        const body = await ctx.req.json();
        logger.info(`${PLAY_MESSAGE.INFO} - ${namespace.name} - ${JSON.stringify(body)}`);

        const { url } = body;

        if (url.length > 0) {
            return {
                code: SUCCESS_CODE,
                message: PLAY_MESSAGE.SUCCESS,
                data: [
                    {
                        play_type: 'hls',
                        play_url: url
                    }
                ]
            };
        }
        logger.error(`${PLAY_MESSAGE.ERROR} - ${namespace.name}`);
        return {
            code: ERROR_CODE,
            message: PLAY_MESSAGE.ERROR,
            data: []
        };
    } catch (error) {
        logger.error(`${PLAY_MESSAGE.ERROR} - ${namespace.name} - ${error}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: PLAY_MESSAGE.ERROR,
            data: []
        };
    }
};
