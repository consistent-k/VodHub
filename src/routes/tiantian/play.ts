import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { PlayRoute } from '@/types';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    const body = await ctx.req.json();
    logger.info(`正在获取详情 - ${namespace.name} - ${JSON.stringify(body)}`);

    const { url, parse_urls } = body;
    let play_type = '';
    let play_url = '';

    if (Array.isArray(parse_urls) && parse_urls.length > 0) {
        // 使用for-of遍历请求解析地址
        for (const parse_url of parse_urls) {
            try {
                const res = await request(`${parse_url}${url}`, 'post');
                const { code } = res;

                if (code === 200) {
                    play_type = res.type;
                    play_url = res.url;
                    break;
                } else {
                    logger.error(`解析地址失败 - ${namespace.name} - ${res}`);
                }
            } catch (e) {
                logger.error(`解析地址失败 - ${namespace.name} - ${e}`);
            }
        }
    }

    return {
        code: 0,
        data: [
            {
                play_type,
                play_url
            }
        ]
    };
};

export const route: PlayRoute = {
    path: '/play',
    name: 'play',
    example: '/tiantian/play',
    description: `获取播放地址`,
    handler,
    method: 'POST'
};
