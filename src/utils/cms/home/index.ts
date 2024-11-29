import { Context } from 'hono';

import request from '../request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { HOME_MESSAGE } from '@/constant/message';
import { HomeData } from '@/types';
import { CMSHomeData } from '@/types/cms';
import { filterHomeData } from '@/utils/filters';
import logger from '@/utils/logger';

export const handler = async (ctx: Context, namespace) => {
    try {
        logger.info(`${HOME_MESSAGE.INFO} - ${namespace.name}`);
        let res = await request.get<CMSHomeData>(`${namespace.url}/api.php/provide/vod`, {
            params: {
                ac: 'list'
            }
        });
        const { code } = res;

        if (code === 1) {
            const newList: HomeData[] = res.class.map((item) => {
                return {
                    type_id: item.type_id,
                    type_name: item.type_name,
                    filters: []
                };
            });
            return {
                code: SUCCESS_CODE,
                message: HOME_MESSAGE.SUCCESS,
                data: filterHomeData(newList)
            };
        }

        logger.error(`${HOME_MESSAGE.ERROR} - ${namespace.name} - ${JSON.stringify(res)}`);
        return {
            code: ERROR_CODE,
            message: HOME_MESSAGE.ERROR,
            data: []
        };
    } catch (error) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        logger.error(`${HOME_MESSAGE.ERROR} - ${namespace.name} - ${error}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: HOME_MESSAGE.ERROR,
            data: []
        };
    }
};
