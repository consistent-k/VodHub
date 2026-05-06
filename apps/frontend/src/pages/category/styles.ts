import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    category: css`
        height: 100%;
        width: 100%;
    `,
    filters: css`
        background: ${token.colorBgContainer};
        border-radius: 8px;
        box-shadow: var(--shadow-border);
        margin-bottom: 24px;
        overflow: hidden;
    `,
    filter: css`
        padding: 16px 20px;
        display: flex;
        gap: 12px;
        align-items: flex-start;
        border-bottom: 1px solid ${token.colorBorder};
        &:last-child {
            border-bottom: none;
        }
    `,
    label: css`
        flex-shrink: 0;
        color: ${token.colorTextTertiary};
        font-size: 12px;
        font-weight: 500;
        min-width: 48px;
        padding-top: 4px;
    `,
    options: css`
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    `,
    option: css`
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 400;
        cursor: pointer;
        transition: all 0.2s;
        color: ${token.colorTextSecondary};
        background: transparent;
        box-shadow: var(--shadow-border);
        &:hover {
            color: ${token.colorText};
            background: var(--color-bg-elevated-hover);
        }
    `,
    active: css`
        color: ${token.colorPrimary};
        background: var(--color-primary-alpha-low);
        box-shadow: 0px 0px 0px 1px rgba(23, 23, 23, 0.2);
    `
}));
