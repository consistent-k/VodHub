import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { PLAY_MESSAGE } from '@/constant/message';
import { PlayRoute } from '@/types';
import { formatStrByReg } from '@/utils/format';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    ctx.res.headers.set('Cache-Control', 'no-cache');
    try {
        const body = await ctx.req.json();
        logger.info(`${PLAY_MESSAGE.INFO} - ${namespace.name} - ${JSON.stringify(body)}`);
        const { url } = body;

        let res = await request.get(`${namespace.url}/${url}`);

        let player_str = formatStrByReg(/<script type="text\/javascript">var player_aaaa=(.*?)<\/script>/, res);
        let play_dic = JSON.parse(player_str);

        if (url.length > 0) {
            return {
                code: SUCCESS_CODE,
                message: PLAY_MESSAGE.SUCCESS,
                data: [
                    {
                        play_type: '',
                        play_url: play_dic.url
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

export const route: PlayRoute = {
    path: '/play',
    name: 'play',
    example: '/mp4movie/play',
    description: `获取播放地址`,
    handler,
    method: 'POST'
};
