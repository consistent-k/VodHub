import request from '../cms/request';

import type { SearcherResult } from './types';

import { USER_AGENT_CHROME } from '@/constant/userAgent';
import type { CMSDetailData } from '@/types/cms';

export async function searchSource(sourceId: string, sourceName: string, sourceUrl: string, keyword: string): Promise<SearcherResult> {
    try {
        const res = await request.get<CMSDetailData>(`${sourceUrl}/api.php/provide/vod`, {
            params: { ac: 'detail', wd: keyword },
            headers: {
                'User-Agent': USER_AGENT_CHROME,
                Referer: `${sourceUrl}/`
            }
        });

        const { list, code } = res;

        if (code === 1 && list) {
            const rawList = list.map((item) => ({
                vod_id: item.vod_id,
                vod_name: item.vod_name,
                vod_pic: item.vod_pic,
                vod_year: item.vod_year
            }));

            return { sourceId, sourceName, rawList };
        }

        return { sourceId, sourceName, rawList: [] };
    } catch {
        return { sourceId, sourceName, rawList: [] };
    }
}
