import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
    carousel: css`
        width: 100%;
        border-radius: 16px;
    `,
    slide: css`
        position: relative;
        cursor: pointer;
        height: 60vh;
        border-radius: 16px;
        overflow: hidden;
        @media (max-width: 768px) {
            height: 50vh;
        }
    `,
    backdrop: css`
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center top;
        background-repeat: no-repeat;
        background-color: var(--color-bg-container);
    `,
    overlay: css`
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, var(--color-bg) 0%, rgba(0, 0, 0, 0.4) 20%, transparent 100%);
        display: flex;
        align-items: flex-end;
    `,
    content: css`
        padding: 40px 48px;
        max-width: 640px;
        width: 100%;
        @media (max-width: 768px) {
            padding: 24px;
        }
    `,
    meta: css`
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
    `,
    year: css`
        color: var(--color-text-secondary);
        font-size: 14px;
        font-weight: 500;
    `,
    title: css`
        font-size: 28px;
        font-weight: 700;
        color: #fff;
        letter-spacing: -0.5px;
        line-height: 1.3;
        margin: 0 0 8px;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        @media (max-width: 768px) {
            font-size: 20px;
        }
    `,
    rating: css`
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
    `,
    score: css`
        color: #fff;
        font-size: 14px;
        font-weight: 600;
    `,
    overview: css`
        color: rgba(255, 255, 255, 0.85);
        font-size: 14px;
        line-height: 1.6;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        @media (max-width: 768px) {
            -webkit-line-clamp: 2;
            font-size: 13px;
        }
    `
}));
