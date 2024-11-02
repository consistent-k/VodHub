import type { Context } from 'hono';

// namespace
interface NamespaceItem {
    name: string;
    url?: string;
    description?: string;
}

interface Namespace extends NamespaceItem {
    zh?: NamespaceItem;
}

export type { Namespace };

// route
interface RouteItem<T> {
    /**
     * The route path, using [Hono routing](https://hono.dev/api/routing) syntax
     */
    path: string | string[];

    /**
     * The human-readable name of the route, which will be used as the level 3 heading in the documentation
     * and radar rule title (can be overridden by `RadarRule[].title`)
     */
    name: string;

    /**
     * The handler function of the route
     */
    handler: (ctx: Context) => Promise<T> | T;

    /**
     * An example URL of the route
     */
    example: string;

    /**
     * Hints and additional explanations for users using this route, it will be appended after the route component, supports markdown
     */
    description?: string;
    method?: 'GET' | 'POST';
}

interface Route extends RouteItem<unknown> {
    ja?: NamespaceItem;
    zh?: NamespaceItem;
    'zh-TW'?: NamespaceItem;
}

// 首页分类列表
export interface HomeData {
    type_id: number; // 类型id
    type_name: string; // 类型名称
    extend: string[]; // 子分类
    area: string[]; // 地区
    lang: string[]; // 语言
    year: string[]; // 年代
}

// 首页视频列表
export interface HomeVodData {
    vod_id: number | string; // 视频id
    vod_name: string; // 视频名称
    vod_pic: string; // 视频封面
    vod_pic_thumb: string; // 视频缩略图/封面
    vod_remarks: string; // 视频备注
    type_id: number | string; // 类型id
    type_name: string; // 类型名称
}

// 按分类视频列表
export interface CategoryVodData {
    vod_id: number | string; // 视频id
    vod_name: string; // 视频名称
    vod_pic: string; // 视频封面
    vod_remarks: string; // 视频备注
}

// 播放地址
export interface VodPlayList {
    name: string; // 线路名称
    urls: Array<{
        name: string; // 播放名称
        url: string; // 播放地址
    }>; // 播放地址
    parse_urls?: string[]; // 解析地址
}

// 视频详情
export interface DetailData {
    vod_id: number; // 视频id
    vod_name: string; // 视频名称
    vod_pic: string; // 视频封面
    vod_remarks: string; // 视频备注
    vod_year: string; // 年代
    vod_area: string; // 地区
    vod_actor: string; // 演员
    vod_director: string; // 导演
    vod_content: string; // 简介
    vod_play_list: VodPlayList[]; // 播放地址
}

// 播放地址
export interface PlayData {
    play_type: string; // 播放类型
    play_url: string; // 播放地址
}

// 关键词搜索
export interface SearchData {
    vod_id: number | string; // 视频id
    vod_name: string; // 视频名称
    vod_pic: string; // 视频封面
    vod_remarks: string; // 视频备注
}

// 首页路由
type HomeRoute = RouteItem<{ code: number; data: HomeData[] }>;

// 首页视频路由
type HomeVodRoute = RouteItem<{ code: number; data: HomeVodData[] }>;

// 按分类视频路由
type CategoryRoute = RouteItem<{ code: number; data: CategoryVodData[] }>;

// 视频详情
type DetailRoute = RouteItem<{ code: number; data: DetailData[] }>;

// 播放地址
type PlayRoute = RouteItem<{ code: number; data: PlayData[] }>;

// 关键词搜索
type SearchRoute = RouteItem<{ code: number; data: SearchData[] }>;

export type { Route, HomeRoute, HomeVodRoute, CategoryRoute, DetailRoute, PlayRoute, SearchRoute };
