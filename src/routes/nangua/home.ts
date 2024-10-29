import { namespace } from './namespace';
import request from './request';

import { HomeData, HomeRoute } from '@/types';
import logger from '@/utils/logger';

const handler = async (ctx) => {
    try {
        logger.info(`正在获取首页分类列表 - ${namespace.name}`);
        const res = await request<any, any>(`${namespace.url}/api.php/provide/home_nav`, {
            method: 'POST'
        });
        const home_data: HomeData[] = [];
        res.forEach((item: any) => {
            if (item.name !== '精选') {
                const newData: HomeData = {
                    type_id: item.id,
                    type_name: item.name,
                    lang: [],
                    extend: item.msg.find((msg: any) => msg.name === 'type').data.filter((fItem) => fItem !== '类型'),
                    area: item.msg.find((msg: any) => msg.name === 'area').data.filter((fItem) => fItem !== '地区'),
                    year: item.msg.find((msg: any) => msg.name === 'year').data.filter((fItem) => fItem !== '年份')
                };
                home_data.push(newData);
            }
        });

        return {
            code: 0,
            data: home_data
        };
    } catch (error) {
        logger.error(`获取首页分类列表失败 - ${namespace.name} - ${error}`);
        ctx.res.headers.set('Cache-Control', 'no-cache'); // 禁止缓存
        return {
            code: -1,
            data: []
        };
    }
};

export const route: HomeRoute = {
    path: '/home',
    name: 'home',
    example: '/nangua/home',
    description: `首页分类列表`,
    handler
};
