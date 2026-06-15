import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    trigger: css`
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 16px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        color: ${token.colorPrimary};
        background: var(--color-primary-alpha-low);
        border: 1px solid var(--color-primary-alpha-medium);
        cursor: pointer;
        transition: all 0.2s;
        &:hover {
            background: var(--color-primary-alpha-hover);
        }
    `,
    panel: css`
        position: fixed;
        width: 360px;
        max-height: 480px;
        z-index: 1000;
        border-radius: 12px;
        overflow: hidden;
        box-shadow:
            0 6px 16px 0 rgba(0, 0, 0, 0.08),
            0 3px 6px -4px rgba(0, 0, 0, 0.12),
            0 9px 28px 8px rgba(0, 0, 0, 0.05);
        .ant-card-body {
            padding: 0;
            display: flex;
            flex-direction: column;
            max-height: 480px;
        }
    `,
    panelHeader: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        border-bottom: 1px solid ${token.colorBorderSecondary};
        cursor: move;
        user-select: none;
        flex-shrink: 0;
    `,
    panelTitle: css`
        font-size: 14px;
        font-weight: 600;
        color: ${token.colorText};
    `,
    panelActions: css`
        display: flex;
        align-items: center;
        gap: 4px;
    `,
    panelContent: css`
        padding: 16px;
        overflow-y: auto;
        flex: 1;
        font-size: 14px;
        line-height: 1.8;
        color: ${token.colorText};
    `,
    cursor: css`
        display: inline-block;
        width: 2px;
        height: 16px;
        background: ${token.colorPrimary};
        margin-left: 2px;
        vertical-align: text-bottom;
        animation: blink 1s step-end infinite;
        @keyframes blink {
            0%,
            100% {
                opacity: 1;
            }
            50% {
                opacity: 0;
            }
        }
    `,
    error: css`
        color: ${token.colorError};
        font-size: 13px;
        padding: 8px 0;
    `
}));
