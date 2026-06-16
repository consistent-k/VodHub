import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    section: css`
        background: ${token.colorBgContainer};
        border-radius: 8px;
        box-shadow: var(--shadow-border);
        padding: 20px;
    `,
    title: css`
        font-size: 18px;
        font-weight: 600;
        color: ${token.colorText};
        margin-bottom: 16px;
        letter-spacing: -0.32px;
    `,
    scroll: css`
        display: flex;
        gap: 16px;
        overflow-x: auto;
        padding-bottom: 8px;
        scroll-behavior: smooth;
        &::-webkit-scrollbar {
            height: 4px;
        }
        &::-webkit-scrollbar-thumb {
            background: ${token.colorBorder};
            border-radius: 2px;
        }
    `,
    card: css`
        flex-shrink: 0;
        width: 100px;
        text-align: center;
        cursor: pointer;
    `,
    avatar: css`
        width: 72px;
        height: 72px;
        border-radius: 50%;
        object-fit: cover;
        margin: 0 auto;
        background: ${token.colorBgElevated};
    `,
    name: css`
        font-size: 13px;
        font-weight: 500;
        color: ${token.colorText};
        margin-top: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    `,
    character: css`
        font-size: 12px;
        color: ${token.colorTextTertiary};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    `
}));
