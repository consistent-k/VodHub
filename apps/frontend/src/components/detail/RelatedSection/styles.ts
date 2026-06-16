import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    section: css`
        background: ${token.colorBgContainer};
        border-radius: 8px;
        box-shadow: var(--shadow-border);
        padding: 20px;
        margin-top: 24px;
    `,
    title: css`
        font-size: 18px;
        font-weight: 600;
        color: ${token.colorText};
        margin-bottom: 16px;
        letter-spacing: -0.32px;
    `
}));
