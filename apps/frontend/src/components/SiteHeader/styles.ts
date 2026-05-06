import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
    header: css`
        padding: 0 24px !important;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 56px;
        background: var(--color-bg-container-alpha);
        backdrop-filter: blur(24px) saturate(1.8);
        -webkit-backdrop-filter: blur(24px) saturate(1.8);
        border-bottom: 1px solid var(--color-border-secondary);
        position: sticky;
        top: 0;
        z-index: 100;
        @media (max-width: 640px) {
            padding: 0 16px !important;
        }
    `,
    logo: css`
        cursor: pointer;
        transition: opacity 0.2s ease;
        &:hover {
            opacity: 0.85;
        }
    `,
    logoIcon: css`
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
        color: var(--color-text);
        transition: transform 0.2s ease;
        &:hover {
            transform: scale(1.05);
        }
        @media (max-width: 640px) {
            width: 28px;
            height: 28px;
            svg {
                width: 16px;
                height: 16px;
            }
        }
    `,
    title: css`
        font-size: 17px;
        font-weight: 600;
        color: var(--color-text);
        letter-spacing: -0.01em;
        @media (max-width: 640px) {
            font-size: 15px;
        }
    `,
    btn: css`
        font-size: 15px;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: all 0.2s ease;
        color: var(--color-text-tertiary) !important;
        &:hover {
            background: var(--color-primary-alpha-hover) !important;
            color: var(--color-primary) !important;
        }
    `
}));
