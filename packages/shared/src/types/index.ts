export interface Namespace {
    name: string;
    url?: string;
    description?: string;
}

export interface FilterItem {
    label: string;
    value: string;
}

export interface Filter {
    type: 'area' | 'lang' | 'year' | 'class' | 'order';
    children: FilterItem[];
}

export interface HomeData {
    type_id: string | number;
    type_name: string;
    filters: Filter[];
}

export interface HomeVodData {
    vod_id: number | string;
    vod_name: string;
    vod_pic: string;
    vod_pic_thumb: string;
    vod_remarks: string;
    type_id: number | string;
    type_name: string;
}

export interface CategoryVodData {
    vod_id: number | string;
    vod_name: string;
    vod_pic: string;
    vod_remarks: string;
}

export interface VodPlayUrl {
    name: string;
    url: string;
}

export interface VodPlayList {
    name: string;
    urls: VodPlayUrl[];
    parse_urls?: string[];
}

export interface DetailData {
    vod_id: number | string;
    vod_name: string;
    vod_pic: string;
    vod_remarks: string;
    vod_year: string;
    vod_area: string;
    vod_actor: string;
    vod_director: string;
    vod_content: string;
    vod_play_list: VodPlayList[];
}

export interface PlayData {
    play_type: string;
    play_url: string;
}

export interface SearchData {
    type_id?: number | string;
    type_name?: string;
    vod_id: number | string;
    vod_name: string;
    vod_pic: string;
    vod_remarks: string;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}
