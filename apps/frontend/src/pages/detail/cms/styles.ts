import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    page: css`
        height: 100%;
        width: 100%;
        padding-bottom: 24px;
    `,
    content: css`
        display: flex;
        flex-direction: column;
        gap: 24px;
    `,
    tabs: css`
        background: ${token.colorBgContainer};
        border-radius: 8px;
        box-shadow: var(--shadow-border);
        padding: 4px 20px 20px;
    `
}));
