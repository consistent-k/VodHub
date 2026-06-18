import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    player: css`
        background: ${token.colorBgContainer};
        border-radius: 12px;
        overflow: hidden;
        box-shadow: var(--shadow-border);
    `,
    playlist: css`
        background: ${token.colorBgContainer};
        border-radius: 8px;
        box-shadow: var(--shadow-border);
        padding: 20px;
    `,
    header: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
    `,
    title: css`
        font-size: 18px;
        font-weight: 600;
        color: ${token.colorText};
        letter-spacing: -0.32px;
    `,
    episodes: css`
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        max-height: 300px;
        overflow-y: auto;
    `,
    episode: css`
        flex: 0 0 calc(33.33% - 6px);
        padding: 10px 12px;
        background: ${token.colorBgElevated};
        border-radius: 6px;
        font-size: 12px;
        font-weight: 400;
        color: ${token.colorTextSecondary};
        cursor: pointer;
        transition: all 0.2s;
        text-align: center;
        box-shadow: var(--shadow-border);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:hover {
            color: ${token.colorText};
            background: var(--color-bg-elevated-hover);
        }
    `,
    episodeActive: css`
        color: ${token.colorPrimary};
        background: var(--color-primary-alpha-low);
        box-shadow: 0px 0px 0px 1px rgba(23, 23, 23, 0.2);
    `,
    playerPlaceholder: css`
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        aspect-ratio: 16 / 9;
        background: ${token.colorBgElevated};
    `
}));
