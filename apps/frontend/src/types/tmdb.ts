export type TmdbMediaType = 'movie' | 'tv';

export interface TmdbMediaItem {
    id: number;
    mediaType: TmdbMediaType;
    title: string;
    originalTitle: string;
    overview: string;
    posterPath: string | null;
    backdropPath: string | null;
    releaseDate: string;
    voteAverage: number;
    voteCount: number;
    genreIds: number[];
    popularity: number;
    originalLanguage: string;
}

export interface TmdbGenre {
    id: number;
    name: string;
}

export interface TmdbCastMember {
    id: number;
    name: string;
    character: string;
    profilePath: string | null;
    order: number;
}

export interface TmdbDetail extends TmdbMediaItem {
    genres: TmdbGenre[];
    runtime?: number;
    episodeRunTime?: number[];
    numberOfSeasons?: number;
    numberOfEpisodes?: number;
    status: string;
    tagline: string;
    homepage: string;
}

export interface CmsMatchResult {
    vod_id: string | number;
    vod_name: string;
    vod_pic: string;
    site: string;
    sourceName: string;
}
