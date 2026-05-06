import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    setting: css`
        height: 100%;
        width: 100%;
        margin: 0 auto;
        padding: 24px;
        background: ${token.colorBgLayout};
    `,
    page: css`
        max-width: 1200px;
        margin: 0 auto;
    `,
    card: css`
        background: ${token.colorBgContainer} !important;
        border-radius: 8px !important;
        box-shadow: var(--shadow-border) !important;
        border: none !important;
        transition: all 0.2s ease;
        &:hover {
            box-shadow: var(--shadow-card) !important;
        }
    `,
    formContent: css`
        color: ${token.colorTextTertiary} !important;
        background-color: ${token.colorBgContainer} !important;
        border-radius: 8px !important;
        box-shadow: var(--shadow-border) !important;
        margin-top: 16px !important;
        padding: 24px !important;
    `,
    formButtons: css`
        margin-top: 24px;
    `,
    divider: css`
        margin: 32px 0 24px;
        border-color: ${token.colorBorder} !important;
    `
}));
