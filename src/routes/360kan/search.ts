import { Context } from 'hono';

import { namespace } from './namespace';
import request from './request';

import { ERROR_CODE, SUCCESS_CODE, SYSTEM_ERROR_CODE } from '@/constant/code';
import { SEARCH_MESSAGE } from '@/constant/message';
import { SearchData, SearchRoute } from '@/types';
import { filterSearchData } from '@/utils/filters';
import logger from '@/utils/logger';

// 源头的关键词搜索数据
interface SearchDataOrigin {
    keywordData: {
        kw: string;
        origKw: string;
        depend: {
            kw: string;
            type: string;
        };
    };
    longData: {
        rows: Array<{
            cat_id: string;
            id: string;
            en_id: string;
            cat_name: string;
            url: string;
            cover: string;
            coverInfo: {
                quality: string;
                duration: string;
                score: string;
            };
            titleTxt: string;
            title: string;
            titlealias: string;
            year: string;
            description: string;
            area: string[];
            tag: string[];
            score: string;
            qualityLv: number;
            pos: number;
            actList: string[];
            dirList: string[];
            actName: string;
            dirName: string;
            vipSite: string[];
            vip: boolean;
            video_status: string;
            playlinks: Record<string, string>;
            outc: string;
            minilist: string[];
            c: string;
        }>;
        countInfo: {
            showNum: number;
            hideNum: number;
            hideCatsNum: Record<string, number>;
        };
    };
    miniData: undefined;
    CondData: undefined;
    SearchFilterData: undefined;
    topPicData: undefined;
    starData: undefined;
    soHotData: undefined;
    comm: undefined;
    sid: string;
    cat: string;
    toplist: Array<{
        name: string;
        alias: string;
        list: Array<{
            title: string;
            cover: string;
            url: string;
            pv: string;
            c: string;
        }>;
    }>;
    plan: string;
    sensitive: boolean;
    rank: string[];
    adconf_svc: string[];
}

const handler = async (ctx: Context) => {
    try {
        const body = await ctx.req.json();
        logger.info(`${SEARCH_MESSAGE.INFO} - ${namespace.name} - ${JSON.stringify(body)}`);

        const { page, keyword } = body;

        const res = await request.get<SearchDataOrigin>(`https://api.so.360kan.com/index`, {
            params: {
                kw: keyword,
                from: '',
                pageno: page,
                v_ap: 1,
                tab: 'all',
                force_v: 1
            }
        });

        const { data, code } = res;

        if (code === 0) {
            let newList: SearchData[] = [];
            data.longData.rows.forEach((item) => {
                newList.push({
                    type_name: item.cat_name,
                    type_id: item.cat_id,
                    vod_id: `${item.en_id}+${item.cat_id}`,
                    vod_name: item.titleTxt,
                    vod_pic: !item.cover.startsWith('http') ? `https:${item.cover}` : item.cover,
                    vod_remarks: item.coverInfo.duration
                });
            });

            return {
                code: SUCCESS_CODE,
                message: SEARCH_MESSAGE.SUCCESS,
                data: filterSearchData(newList)
            };
        }

        logger.error(`${SEARCH_MESSAGE.ERROR} - ${namespace.name} - ${JSON.stringify(res)}`);
        return {
            code: ERROR_CODE,
            message: SEARCH_MESSAGE.ERROR,
            data: []
        };
    } catch (error) {
        ctx.res.headers.set('Cache-Control', 'no-cache');
        logger.error(`${SEARCH_MESSAGE.ERROR} - ${namespace.name} - ${error}`);
        return {
            code: SYSTEM_ERROR_CODE,
            message: SEARCH_MESSAGE.ERROR,
            data: []
        };
    }
};

export const route: SearchRoute = {
    path: '/search',
    name: 'search',
    example: '/360kan/search',
    description: `关键词搜索`,
    handler,
    method: 'POST'
};
