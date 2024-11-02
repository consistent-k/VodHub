import { Context } from 'hono';

import { namespace } from './namespace';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { PLAY_MESSAGE } from '@/constant/message';
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
        logger.info(`${PLAY_MESSAGE.INFO} - ${namespace.name} - ${JSON.stringify(body)}`);

        const { url, parse_urls } = body;
        let play_type = '';
        let play_url = '';

        if (Array.isArray(parse_urls) && parse_urls.length > 0) {
            // 使用for-of遍历请求解析地址
            for (const parse_url of parse_urls) {
                try {
                    const res = await request.post<unknown, PlayDataOrigin>(
                        `${parse_url}${url}`,
                        {},
                        {
                            timeout: 4000
                        }
                    );
                    const { code } = res;

                    if (code === 200 && url.length > 0) {
                        play_type = res.type;
                        play_url = res.url;
                        break;
                    }
                } catch (e) {
                    logger.error(`${PLAY_MESSAGE.ERROR} - ${namespace.name} - ${e}`);
                }
            }
        }

        if (play_url.length > 0) {
            return {
                code: SUCCESS_CODE,
                message: PLAY_MESSAGE.SUCCESS,
                data: [
                    {
                        play_type,
                        play_url
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
    example: '/tiantian/play',
    description: `获取播放地址`,
    handler,
    method: 'POST'
};
