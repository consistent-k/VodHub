import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { DetailData, DetailRoute, VodPlayList } from '@/types';
import { formatVodContent } from '@/utils/format';
import logger from '@/utils/logger';

// 源头详情数据
interface DetailDataOrigin {
    list: Array<{
        vod_id: number;
        type_id: number;
        type_id_1: number;
        group_id: number;
        vod_name: string;
        vod_sub: string;
        vod_en: string;
        vod_status: number;
        vod_letter: string;
        vod_color: string;
        vod_tag: string;
        vod_class: string;
        vod_pic: string;
        vod_pic_thumb: string;
        vod_pic_slide: string;
        vod_pic_screenshot: string;
        vod_actor: string;
        vod_director: string;
        vod_writer: string;
        vod_behind: string;
        vod_blurb: string;
        vod_remarks: string;
        vod_pubdate: string;
        vod_total: string;
        vod_serial: string;
        vod_tv: string;
        vod_weekday: string;
        vod_area: string;
        vod_lang: string;
        vod_year: string;
        vod_version: string;
        vod_state: string;
        vod_author: string;
        vod_jumpurl: string;
        vod_tpl: string;
        vod_tpl_play: string;
        vod_tpl_down: string;
        vod_isend: number;
        vod_lock: number;
        vod_level: number;
        vod_copyright: string;
        vod_points: number;
        vod_points_play: number;
        vod_points_down: number;
        vod_hits: number;
        vod_hits_day: number;
        vod_hits_week: number;
        vod_hits_month: number;
        vod_duration: string;
        vod_up: number;
        vod_down: number;
        vod_score: string;
        vod_score_all: number;
        vod_score_num: number;
        vod_time: string;
        vod_time_add: string;
        vod_time_hits: string;
        vod_time_make: string;
        vod_trysee: number;
        vod_douban_id: string;
        vod_douban_score: string;
        vod_reurl: string;
        vod_rel_vod: string;
        vod_rel_art: string;
        vod_pwd: string;
        vod_pwd_url: string;
        vod_pwd_play: string;
        vod_pwd_play_url: string;
        vod_pwd_down: string;
        vod_pwd_down_url: string;
        vod_content: string;
        vod_play_from: string;
        vod_play_server: string;
        vod_play_note: string;
        vod_play_url: string;
        vod_down_from: string;
        vod_down_server: string;
        vod_down_note: string;
        vod_down_url: string;
        vod_plot: number;
        vod_plot_name: string;
        vod_plot_detail: string;
        type_name: string;
    }>;
}

function parseEpisodes(str): VodPlayList['urls'] {
    // 使用正则表达式匹配所有的集数和链接
    const regex = /第(\d+)集\$(https:\/\/[^#]+)#/g;
    let match: RegExpExecArray | null = null;
    const episodes: VodPlayList['urls'] = [];

    // 循环匹配所有结果
    while ((match = regex.exec(str)) !== null) {
        // 将匹配结果添加到数组中
        episodes.push({
            name: `第${match[1]}集`, // 集数
            url: match[2] // 链接
        });
    }

    return episodes;
}

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`正在获取详情 - ${namespace.name} - ${JSON.stringify(body)}`);

        const { id } = body;

        const res = await request.get<DetailDataOrigin>(`${namespace.url}/api.php/provide/vod/?ac=detail`, {
            params: {
                ids: id
            }
        });

        // return res;

        const { list, code } = res;

        if (code === 1 && list.length > 0) {
            const data = list[0];
            const detailData: DetailData = {
                vod_id: data.vod_id,
                vod_name: data.vod_name,
                vod_pic: data.vod_pic,
                vod_remarks: data.vod_remarks,
                vod_year: data.vod_year,
                vod_area: data.vod_area,
                vod_actor: data.vod_actor,
                vod_director: data.vod_director,
                vod_content: formatVodContent(data.vod_content),
                vod_play_list: [
                    {
                        name: data.vod_play_from,
                        urls: parseEpisodes(data.vod_play_url),
                        parse_urls: []
                    }
                ]
            };
            return {
                code: 0,
                data: [detailData]
            };
        }

        logger.error(`获取详情失败 - ${namespace.name} - ${JSON.stringify(res)}`);

        return {
            code: -1,
            data: []
        };
    } catch (error) {
        logger.error(`获取详情失败 - ${namespace.name} - ${error}`);

        return {
            code: -1,
            data: []
        };
    }
};

export const route: DetailRoute = {
    path: '/detail',
    name: 'detail',
    example: '/mdzy/detail',
    description: `获取详情`,
    handler,
    method: 'POST'
};
