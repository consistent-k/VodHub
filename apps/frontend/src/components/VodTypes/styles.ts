import { createStyles, keyframes } from 'antd-style';

const slideIn = keyframes`
    from {
        width: 0;
        opacity: 0;
    }
    to {
        width: 20px;
        opacity: 1;
    }
`;

export const useStyles = createStyles(({ css, token }) => ({
    vodTypes: css`
        background: ${token.colorBgContainer};
        backdrop-filter: blur(12px);
        border-bottom: 1px solid ${token.colorBorder};
        position: relative;
        padding: 0 24px;
    `,
    tabsWrapper: css`
        display: flex;
        align-items: center;
        position: relative;
        @media (max-width: 768px) {
            padding: 0 8px;
        }
    `,
    scrollButton: css`
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: ${token.colorBgElevated};
        border: none;
        border-radius: 6px;
        color: ${token.colorTextSecondary};
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;
        z-index: 2;
        margin: 0 8px;
        box-shadow: var(--shadow-border);
        &:hover {
            background: var(--color-bg-elevated-hover);
            color: ${token.colorText};
            box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.2);
        }
        &:active {
            transform: scale(0.95);
        }
        &:focus-visible {
            outline: 2px solid var(--focus-blue);
            outline-offset: 2px;
        }
        @media (max-width: 768px) {
            width: 28px;
            height: 28px;
            margin: 0 4px;
        }
        @media (prefers-reduced-motion: reduce) {
            transition: none;
            animation: none;
        }
    `,
    tabsContainer: css`
        flex: 1;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
        scroll-behavior: smooth;
        &::-webkit-scrollbar {
            display: none;
        }
    `,
    tabsList: css`
        display: flex;
        gap: 4px;
        padding: 8px 0;
        min-width: max-content;
    `,
    tabItem: css`
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 16px;
        background: transparent;
        border: none;
        border-radius: 6px;
        color: ${token.colorTextSecondary};
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
        outline: none;
        &:hover {
            color: ${token.colorText};
            background: ${token.colorBgElevated};
        }
        &:focus-visible {
            outline: 2px solid var(--focus-blue);
            outline-offset: 2px;
        }
        @media (max-width: 768px) {
            padding: 8px 12px;
            font-size: 13px;
        }
        @media (prefers-reduced-motion: reduce) {
            transition: none;
            animation: none;
        }
    `,
    active: css`
        color: ${token.colorText};
        background: var(--color-primary-alpha-hover);
        box-shadow: var(--shadow-border);
    `,
    tabLabel: css`
        position: relative;
        z-index: 1;
        font-weight: 600;
    `,
    activeIndicator: css`
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 3px;
        background: ${token.colorPrimary};
        border-radius: 2px;
        animation: ${slideIn} 0.2s ease;
        @media (prefers-reduced-motion: reduce) {
            transition: none;
            animation: none;
        }
    `
}));
