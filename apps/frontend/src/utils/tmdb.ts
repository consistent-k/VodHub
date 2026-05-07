const IMAGE_BASE = 'https://image.tmdb.org/t/p/';

export const getPosterUrl = (path: string | null | undefined, size = 'w342'): string => {
    if (!path) return '';
    return `${IMAGE_BASE}${size}${path}`;
};

export const getBackdropUrl = (path: string | null | undefined, size = 'w780'): string => {
    if (!path) return '';
    return `${IMAGE_BASE}${size}${path}`;
};

export const getProfileUrl = (path: string | null | undefined, size = 'w185'): string => {
    if (!path) return '';
    return `${IMAGE_BASE}${size}${path}`;
};
