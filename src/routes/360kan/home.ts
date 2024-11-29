import { namespace } from './namespace';

import { SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { HOME_MESSAGE } from '@/constant/message';
import { HomeData, HomeRoute } from '@/types';
import { filterHomeData } from '@/utils/filters';
import logger from '@/utils/logger';

const YearList = [
    {
        label: '全部',
        value: ''
    },
    {
        label: '2024',
        value: '2024'
    },
    {
        label: '2023',
        value: '2023'
    },
    {
        label: '2022',
        value: '2022'
    },
    {
        label: '2021',
        value: '2021'
    },
    {
        label: '2020',
        value: '2020'
    },
    {
        label: '2019',
        value: '2019'
    },
    {
        label: '2018',
        value: '2018'
    },
    {
        label: '2017',
        value: '2017'
    },
    {
        label: '2016',
        value: '2016'
    },
    {
        label: '2015',
        value: '2015'
    },
    {
        label: '2014',
        value: '2014'
    },
    {
        label: '2013',
        value: '2013'
    },
    {
        label: '2012',
        value: '2012'
    },
    {
        label: '2010',
        value: '2010'
    },
    {
        label: '2009',
        value: '2009'
    },
    {
        label: '2008',
        value: '2008'
    },
    {
        label: '2007',
        value: '2007'
    },
    {
        label: '更早',
        value: 'lt_year'
    }
];

const handler = async (ctx) => {
    try {
        logger.info(`${HOME_MESSAGE.INFO} - ${namespace.name}`);
        const newList: HomeData[] = [
            {
                type_id: '1',
                type_name: '电影',
                filters: [
                    {
                        type: 'class',
                        children: [
                            {
                                label: '全部',
                                value: '全部'
                            },
                            {
                                label: '喜剧',
                                value: '喜剧'
                            },
                            {
                                label: '爱情',
                                value: '爱情'
                            },
                            {
                                label: '动作',
                                value: '动作'
                            },
                            {
                                label: '恐怖',
                                value: '恐怖'
                            },
                            {
                                label: '科幻',
                                value: '科幻'
                            },
                            {
                                label: '剧情',
                                value: '剧情'
                            },
                            {
                                label: '犯罪',
                                value: '犯罪'
                            },
                            {
                                label: '奇幻',
                                value: '奇幻'
                            },
                            {
                                label: '战争',
                                value: '战争'
                            },
                            {
                                label: '悬疑',
                                value: '悬疑'
                            },
                            {
                                label: '动画',
                                value: '动画'
                            },
                            {
                                label: '文艺',
                                value: '文艺'
                            },
                            {
                                label: '纪录',
                                value: '纪录'
                            },
                            {
                                label: '传记',
                                value: '传记'
                            },
                            {
                                label: '歌舞',
                                value: '歌舞'
                            },
                            {
                                label: '古装',
                                value: '古装'
                            },
                            {
                                label: '历史',
                                value: '历史'
                            },
                            {
                                label: '惊悚',
                                value: '惊悚'
                            },
                            {
                                label: '其他',
                                value: '其他'
                            }
                        ]
                    },
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
                                label: '中国香港',
                                value: '香港'
                            },
                            {
                                label: '中国台湾',
                                value: '台湾'
                            },
                            {
                                label: '泰国',
                                value: '泰国'
                            },
                            {
                                label: '美国',
                                value: '美国'
                            },
                            {
                                label: '韩国',
                                value: '韩国'
                            },
                            {
                                label: '日本',
                                value: '日本'
                            },
                            {
                                label: '法国',
                                value: '法国'
                            },
                            {
                                label: '英国',
                                value: '英国'
                            },
                            {
                                label: '德国',
                                value: '德国'
                            },
                            {
                                label: '印度',
                                value: '印度'
                            },
                            {
                                label: '其他',
                                value: '其他'
                            }
                        ]
                    },
                    {
                        type: 'year',
                        children: YearList
                    },
                    {
                        type: 'order',
                        children: [
                            {
                                label: '最近热映',
                                value: 'rankhot'
                            },
                            {
                                label: '最近上映',
                                value: 'ranklatest'
                            },
                            {
                                label: '最受好评',
                                value: 'rankpoint'
                            }
                        ]
                    }
                ]
            },
            {
                type_id: '2',
                type_name: '剧集',
                filters: [
                    {
                        type: 'class',
                        children: [
                            {
                                label: '全部',
                                value: '全部'
                            },
                            {
                                label: '言情',
                                value: '言情'
                            },
                            {
                                label: '剧情',
                                value: '剧情'
                            },
                            {
                                label: '喜剧',
                                value: '喜剧'
                            },
                            {
                                label: '悬疑',
                                value: '悬疑'
                            },
                            {
                                label: '都市',
                                value: '都市'
                            },
                            {
                                label: '偶像',
                                value: '偶像'
                            },
                            {
                                label: '古装',
                                value: '古装'
                            },
                            {
                                label: '军事',
                                value: '军事'
                            },
                            {
                                label: '警匪',
                                value: '警匪'
                            },
                            {
                                label: '历史',
                                value: '历史'
                            },
                            {
                                label: '励志',
                                value: '励志'
                            },
                            {
                                label: '神话',
                                value: '神话'
                            },
                            {
                                label: '谍战',
                                value: '谍战'
                            },
                            {
                                label: '青春',
                                value: '青春'
                            },
                            {
                                label: '家庭',
                                value: '家庭'
                            },
                            {
                                label: '动作',
                                value: '动作'
                            },
                            {
                                label: '情景',
                                value: '情景'
                            },
                            {
                                label: '武侠',
                                value: '武侠'
                            },
                            {
                                label: '科幻',
                                value: '科幻'
                            },
                            {
                                label: '其他',
                                value: '其他'
                            }
                        ]
                    },
                    {
                        type: 'area',
                        children: [
                            {
                                label: '全部',
                                value: ''
                            },
                            {
                                label: '内地',
                                value: '内地'
                            },
                            {
                                label: '中国香港',
                                value: '香港'
                            },
                            {
                                label: '中国台湾',
                                value: '台湾'
                            },
                            {
                                label: '泰国',
                                value: '泰国'
                            },
                            {
                                label: '日本',
                                value: '日本'
                            },
                            {
                                label: '韩国',
                                value: '韩国'
                            },
                            {
                                label: '美国',
                                value: '美国'
                            },
                            {
                                label: '英国',
                                value: '英国'
                            },
                            {
                                label: '新加坡',
                                value: '新加坡'
                            }
                        ]
                    },
                    {
                        type: 'year',
                        children: YearList
                    },
                    {
                        type: 'order',
                        children: [
                            {
                                label: '最近热映',
                                value: 'rankhot'
                            },
                            {
                                label: '最近上映',
                                value: 'ranklatest'
                            },
                            {
                                label: '最受好评',
                                value: 'rankpoint'
                            }
                        ]
                    }
                ]
            },
            {
                type_id: '3',
                type_name: '综艺',
                filters: [
                    {
                        type: 'class',
                        children: [
                            {
                                label: '全部',
                                value: ''
                            },
                            {
                                label: '脱口秀',
                                value: '脱口秀'
                            },
                            {
                                label: '真人秀',
                                value: '真人秀'
                            },
                            {
                                label: '搞笑',
                                value: '搞笑'
                            },
                            {
                                label: '选秀',
                                value: '选秀'
                            },
                            {
                                label: '八卦',
                                value: '八卦'
                            },
                            {
                                label: '访谈',
                                value: '访谈'
                            },
                            {
                                label: '情感',
                                value: '情感'
                            },
                            {
                                label: '生活',
                                value: '生活'
                            },
                            {
                                label: '晚会',
                                value: '晚会'
                            },
                            {
                                label: '音乐',
                                value: '音乐'
                            },
                            {
                                label: '职场',
                                value: '职场'
                            },
                            {
                                label: '美食',
                                value: '美食'
                            },
                            {
                                label: '时尚',
                                value: '时尚'
                            },
                            {
                                label: '游戏',
                                value: '游戏'
                            },
                            {
                                label: '少儿',
                                value: '少儿'
                            },
                            {
                                label: '体育',
                                value: '体育'
                            },
                            {
                                label: '纪实',
                                value: '纪实'
                            },
                            {
                                label: '科教',
                                value: '科教'
                            },
                            {
                                label: '曲艺',
                                value: '曲艺'
                            },
                            {
                                label: '歌舞',
                                value: '歌舞'
                            },
                            {
                                label: '财经',
                                value: '财经'
                            },
                            {
                                label: '汽车',
                                value: '汽车'
                            },
                            {
                                label: '播报',
                                value: '播报'
                            },
                            {
                                label: '其他',
                                value: '其他'
                            }
                        ]
                    },
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
                                label: '中国香港',
                                value: '香港'
                            },
                            {
                                label: '中国台湾',
                                value: '台湾'
                            },
                            {
                                label: '日本',
                                value: '日本'
                            },
                            {
                                label: '欧美',
                                value: '欧美'
                            }
                        ]
                    },
                    {
                        type: 'order',
                        children: [
                            {
                                label: '最近热映',
                                value: 'rankhot'
                            },
                            {
                                label: '最近上映',
                                value: 'ranklatest'
                            }
                        ]
                    }
                ]
            },
            {
                type_id: '4',
                type_name: '动漫',
                filters: [
                    {
                        type: 'class',
                        children: [
                            {
                                label: '全部',
                                value: ''
                            },
                            {
                                label: '热血',
                                value: '热血'
                            },
                            {
                                label: '科幻',
                                value: '科幻'
                            },
                            {
                                label: '美少女',
                                value: '美少女'
                            },
                            {
                                label: '魔幻',
                                value: '魔幻'
                            },
                            {
                                label: '经典',
                                value: '经典'
                            },
                            {
                                label: '励志',
                                value: '励志'
                            },
                            {
                                label: '少儿',
                                value: '少儿'
                            },
                            {
                                label: '冒险',
                                value: '冒险'
                            },
                            {
                                label: '搞笑',
                                value: '搞笑'
                            },
                            {
                                label: '推理',
                                value: '推理'
                            },
                            {
                                label: '恋爱',
                                value: '恋爱'
                            },
                            {
                                label: '治愈',
                                value: '治愈'
                            },
                            {
                                label: '幻想',
                                value: '幻想'
                            },
                            {
                                label: '校园',
                                value: '校园'
                            },
                            {
                                label: '动物',
                                value: '动物'
                            },
                            {
                                label: '机战',
                                value: '机战'
                            },
                            {
                                label: '亲子',
                                value: '亲子'
                            },
                            {
                                label: '儿歌',
                                value: '儿歌'
                            },
                            {
                                label: '运动',
                                value: '运动'
                            },
                            {
                                label: '悬疑',
                                value: '悬疑'
                            },
                            {
                                label: '怪物',
                                value: '怪物'
                            },
                            {
                                label: '战争',
                                value: '战争'
                            },
                            {
                                label: '益智',
                                value: '益智'
                            },
                            {
                                label: '青春',
                                value: '青春'
                            },
                            {
                                label: '童话',
                                value: '童话'
                            },
                            {
                                label: '竞技',
                                value: '竞技'
                            },
                            {
                                label: '动作',
                                value: '动作'
                            },
                            {
                                label: '社会',
                                value: '社会'
                            },
                            {
                                label: '友情',
                                value: '友情'
                            },
                            {
                                label: '真人版',
                                value: '真人版'
                            },
                            {
                                label: '电影版',
                                value: '电影版'
                            },
                            {
                                label: 'OVA版',
                                value: 'OVA版'
                            },
                            {
                                label: 'TV版',
                                value: 'TV版'
                            },
                            {
                                label: '新番动画',
                                value: '新番动画'
                            },
                            {
                                label: '完结动画',
                                value: '完结动画'
                            }
                        ]
                    },
                    {
                        type: 'year',
                        children: YearList
                    },
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
                    {
                        type: 'order',
                        children: [
                            {
                                label: '最近热映',
                                value: 'rankhot'
                            },
                            {
                                label: '最近上映',
                                value: 'ranklatest'
                            }
                        ]
                    }
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
    example: '/360kan/home',
    description: `首页分类列表`,
    handler
};
