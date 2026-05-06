import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    layout: css`
        font-family: 'Inter', 'Microsoft YaHei', sans-serif;
        font-feature-settings: 'liga' 1;
        height: 100%;
        background: ${token.colorBgLayout};
    `,
    content: css`
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 0;
    `,
    main: css`
        flex: 1;
        overflow-y: auto;
        padding: 24px;
    `,
    footer: css`
        display: flex;
        align-items: center;
        justify-content: center;
        height: 48px;
        background: transparent;
        color: ${token.colorTextTertiary};
        font-size: 12px;
        font-weight: 400;
        gap: 8px;
        border-top: 1px solid ${token.colorBorder};
    `,
    footerDivider: css`
        opacity: 0.3;
    `
}));
