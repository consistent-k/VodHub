import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    detail: css`
        height: 100%;
        width: 100%;
    `,
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
    source: css`
        font-size: 12px;
        font-weight: 400;
        color: ${token.colorTextTertiary};
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
    tabs: css`
        background: ${token.colorBgContainer};
        border-radius: 8px;
        box-shadow: var(--shadow-border);
        padding: 4px 20px 20px;
        margin-top: 24px;
    `,
    sourceCard: css`
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        border-radius: 6px;
        cursor: pointer;
        border: 1px solid ${token.colorBorderSecondary};
        background: ${token.colorBgElevated};
        transition: all 0.2s;
        &:hover {
            border-color: var(--color-primary-alpha-medium);
            background: var(--color-bg-elevated-hover);
        }
    `,
    sourceCardActive: css`
        border-color: ${token.colorPrimary};
        background: var(--color-primary-alpha-low);
        box-shadow: 0 0 0 1px var(--color-primary-alpha-medium);
    `,
    sourceInfo: css`
        flex: 1;
        min-width: 0;
    `,
    sourceName: css`
        font-size: 12px;
        font-weight: 500;
        color: ${token.colorText};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    `,
    sourceTitle: css`
        font-size: 11px;
        color: ${token.colorTextTertiary};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 2px;
    `
}));
