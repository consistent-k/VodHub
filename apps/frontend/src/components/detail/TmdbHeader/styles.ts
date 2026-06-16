import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    card: css`
        background: ${token.colorBgContainer};
        border-radius: 12px;
        box-shadow: var(--shadow-border);
        padding: 24px;
        display: flex;
        gap: 24px;
    `,
    poster: css`
        width: 140px;
        height: 210px;
        border-radius: 8px;
        object-fit: cover;
        flex-shrink: 0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `,
    info: css`
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
    `,
    titleRow: css`
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
    `,
    title: css`
        font-size: 24px;
        font-weight: 700;
        color: ${token.colorText};
        line-height: 1.3;
        margin: 0;
    `,
    originalTitle: css`
        font-size: 14px;
        color: ${token.colorTextTertiary};
        margin-top: -4px;
    `,
    tagline: css`
        font-size: 14px;
        font-style: italic;
        color: ${token.colorTextSecondary};
    `,
    metaRow: css`
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        font-size: 14px;
        color: ${token.colorTextSecondary};
    `,
    rating: css`
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 16px;
        font-weight: 600;
        color: ${token.colorText};
    `,
    ratingStar: css`
        color: #fadb14;
    `,
    genres: css`
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    `,
    genreTag: css`
        border-radius: 4px;
        font-size: 12px;
    `,
    overview: css`
        font-size: 14px;
        line-height: 1.6;
        color: ${token.colorTextSecondary};
        margin: 0;
    `
}));
