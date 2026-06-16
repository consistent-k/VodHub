import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    section: css`
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
    progress: css`
        font-size: 13px;
        color: ${token.colorTextSecondary};
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
    `,
    empty: css`
        text-align: center;
        padding: 24px;
        color: ${token.colorTextTertiary};
    `,
    matchingNote: css`
        text-align: center;
        padding: 12px;
        color: ${token.colorTextSecondary};
        font-size: 13px;
    `
}));
