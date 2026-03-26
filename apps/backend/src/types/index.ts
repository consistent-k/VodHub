import type { Context } from 'hono';
export type { Namespace, HomeData, HomeVodData, CategoryVodData, VodPlayList, DetailData, PlayData, SearchData, ApiResponse } from '@vodhub/shared';
export type { Namespace as INamespace } from '@vodhub/shared';

export interface RouteItem<T> {
    path: string | string[];
    method?: 'GET' | 'POST';
    name: string;
    handler: (ctx: Context) => Promise<T> | T;
    example: string;
    description?: string;
}

export type Route = RouteItem<unknown>;
export type HomeRoute = RouteItem<{ code: number; data: import('@vodhub/shared').HomeData[] }>;
export type HomeVodRoute = RouteItem<{ code: number; data: import('@vodhub/shared').HomeVodData[] }>;
export type CategoryRoute = RouteItem<{ code: number; data: import('@vodhub/shared').CategoryVodData[] }>;
export type DetailRoute = RouteItem<{ code: number; data: import('@vodhub/shared').DetailData[] }>;
export type PlayRoute = RouteItem<{ code: number; data: import('@vodhub/shared').PlayData[] }>;
export type SearchRoute = RouteItem<{ code: number; data: import('@vodhub/shared').SearchData[] }>;
