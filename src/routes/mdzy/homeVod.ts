import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { HomeVodData, HomeVodRoute } from '@/types';
import logger from '@/utils/logger';

// 源头的最近更新数据
interface HomeVodDataOrigin {
    list: Array<{
        vod_id: number;
        vod_name: string;
        type_id: string;
        type_name: string;
        vod_en: string;
        vod_time: string;
        vod_remarks: string;
        vod_play_from: string;
    }>;
    class: Array<{
        type_id: number;
        type_pid: number;
        type_name: string;
    }>;
}

const handler = async () => {
    try {
        logger.info(`正在获取最近更新 - ${namespace.name}`);

        let res = await request.get<HomeVodDataOrigin>(`${namespace.url}/api.php/provide/vod/?ac=list`);

        const { code, list } = res;

        let vod_list: HomeVodData[] = [];
        list.forEach((item) => {
            vod_list.push({
                vod_id: item.vod_id,
                vod_name: item.vod_name,
                vod_pic: '',
                vod_pic_thumb: '',
                vod_remarks: item.vod_remarks
            });
        });

        if (code === 1) {
            return {
                code: SUCCESS_CODE,
                data: vod_list
            };
        }

        logger.error(`获取最近更新失败 - ${namespace.name} - ${JSON.stringify(res)}`);
        return {
            code: ERROR_CODE,
            message: '获取最近更新失败',
            data: []
        };
    } catch (error) {
        logger.error(`获取最近更新失败 - ${namespace.name} - ${error}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: '获取最近更新失败',
            data: []
        };
    }
};

export const route: HomeVodRoute = {
    path: '/homeVod',
    name: 'homeVod',
    example: '/mdzy/homeVod',
    description: `最近更新`,
    handler
};
