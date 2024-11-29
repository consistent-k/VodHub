import { Context } from 'hono';

import { namespace } from './namespace';

import { SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { HOME_MESSAGE } from '@/constant/message';
import { HomeData, HomeRoute } from '@/types';
import { filterHomeData } from '@/utils/filters';
import logger from '@/utils/logger';

const handler = async (ctx: Context) => {
    try {
        logger.info(`${HOME_MESSAGE.INFO} - ${namespace.name}`);

        // 排序
        const OrderFilter: HomeData['filters'] = [
            {
                type: 'order',
                children: [
                    {
                        label: '热门',
                        value: 'hot'
                    },
                    {
                        label: '更新',
                        value: 'updata'
                    },
                    {
                        label: '评分',
                        value: 'rating'
                    }
                ]
            }
        ];

        // 年代
        const YearFilter: HomeData['filters'] = [
            {
                type: 'year',
                children: [
                    {
                        label: '全部',
                        value: '0'
                    },
                    {
                        label: '2024',
                        value: '119'
                    },
                    {
                        label: '2023',
                        value: '153'
                    },
                    {
                        label: '2022',
                        value: '101'
                    },
                    {
                        label: '2021',
                        value: '118'
                    },
                    {
                        label: '2020',
                        value: '16'
                    },
                    {
                        label: '2019',
                        value: '7'
                    },
                    {
                        label: '2018',
                        value: '2'
                    },
                    {
                        label: '2017',
                        value: '3'
                    },
                    {
                        label: '2016',
                        value: '22'
                    }
                ]
            }
        ];

        const newList: HomeData[] = [
            {
                type_id: 1,
                type_name: '电影',
                filters: [
                    {
                        type: 'area',
                        children: [
                            {
                                label: '全部',
                                value: ''
                            },
                            {
                                label: '内地',
                                value: '大陆'
                            },
                            {
                                label: '日本',
                                value: '日本'
                            },
                            {
                                label: '美国',
                                value: '美国'
                            }
                        ]
                    },
                    ...YearFilter,
                    ...OrderFilter
                ]
            },
            {
                type_id: 2,
                type_name: '电视剧',
                filters: [
                    {
                        type: 'area',
                        children: [
                            {
                                label: '全部',
                                value: '0'
                            },
                            {
                                label: '国产',
                                value: '1'
                            },
                            {
                                label: '中国香港',
                                value: '3'
                            },
                            {
                                label: '中国台湾',
                                value: '6'
                            },
                            {
                                label: '美国',
                                value: '5'
                            },
                            {
                                label: '韩国',
                                value: '18'
                            },
                            {
                                label: '日本',
                                value: '2'
                            }
                        ]
                    },
                    ...YearFilter,
                    ...OrderFilter
                ]
            },
            {
                type_id: 3,
                type_name: '动漫',
                filters: [
                    {
                        type: 'area',
                        children: [
                            {
                                label: '全部',
                                value: '0'
                            },
                            {
                                label: '国产',
                                value: '1'
                            },
                            {
                                label: '中国香港',
                                value: '3'
                            },
                            {
                                label: '中国台湾',
                                value: '6'
                            },
                            {
                                label: '美国',
                                value: '5'
                            },
                            {
                                label: '韩国',
                                value: '18'
                            },
                            {
                                label: '日本',
                                value: '2'
                            }
                        ]
                    },
                    ...YearFilter,
                    ...OrderFilter
                ]
            },
            {
                type_id: 4,
                type_name: '综艺',
                filters: [
                    {
                        type: 'area',
                        children: [
                            {
                                label: '全部',
                                value: '0'
                            },
                            {
                                label: '国产',
                                value: '1'
                            },
                            {
                                label: '中国香港',
                                value: '3'
                            },
                            {
                                label: '中国台湾',
                                value: '6'
                            },
                            {
                                label: '美国',
                                value: '5'
                            },
                            {
                                label: '韩国',
                                value: '18'
                            },
                            {
                                label: '日本',
                                value: '2'
                            }
                        ]
                    },
                    ...YearFilter,
                    ...OrderFilter
                ]
            }
        ];

        return {
            code: SUCCESS_CODE,
            message: HOME_MESSAGE.SUCCESS,
            data: filterHomeData(newList)
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

export const route: HomeRoute = {
    path: '/home',
    name: 'home',
    example: '/jianpian/home',
    description: `首页分类列表`,
    handler
};
