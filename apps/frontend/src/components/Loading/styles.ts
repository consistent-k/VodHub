import { createStyles, keyframes } from 'antd-style';

const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

export const useStyles = createStyles(({ css }) => ({
    container: css`
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px;
    `,
    fullscreen: css`
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--color-bg);
        z-index: 9999;
        padding: 0;
    `,
    content: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    `,
    spinner: css`
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    `,
    sizeSmall: css`
        width: 32px;
        height: 32px;
    `,
    sizeDefault: css`
        width: 48px;
        height: 48px;
    `,
    sizeLarge: css`
        width: 64px;
        height: 64px;
    `,
    spinnerRing: css`
        position: absolute;
        border-radius: 50%;
        border: 2px solid transparent;
        animation: ${spin} 1.5s linear infinite;
        &:nth-child(1) {
            width: 100%;
            height: 100%;
            border-top-color: var(--color-primary);
            animation-delay: 0s;
        }
        &:nth-child(2) {
            width: 75%;
            height: 75%;
            border-right-color: var(--color-primary-light);
            animation-delay: 0.15s;
            animation-direction: reverse;
        }
        &:nth-child(3) {
            width: 50%;
            height: 50%;
            border-bottom-color: var(--color-primary);
            animation-delay: 0.3s;
        }
        @media (prefers-reduced-motion: reduce) {
            animation: none;
            border-color: var(--color-primary);
            opacity: 0.6;
            &:nth-child(2) {
                border-color: var(--color-primary-light);
                opacity: 0.4;
            }
            &:nth-child(3) {
                border-color: var(--color-primary);
                opacity: 0.2;
            }
        }
    `,
    loadingText: css`
        color: var(--color-text-secondary);
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0.02em;
    `,
    dots: css`
        display: inline-block;
        width: 18px;
        text-align: left;
    `
}));
