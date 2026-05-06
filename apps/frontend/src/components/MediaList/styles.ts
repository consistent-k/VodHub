import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    list: css`
        width: 100%;
    `,
    listHeader: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
    `,
    listTitle: css`
        font-size: 20px;
        font-weight: 600;
        color: ${token.colorText};
        letter-spacing: -0.5px;
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        &::before {
            content: '';
            width: 3px;
            height: 20px;
            background: ${token.colorPrimary};
            border-radius: 2px;
        }
    `,
    listMore: css`
        font-size: 14px;
        font-weight: 500;
        color: ${token.colorTextTertiary};
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        &:hover {
            color: ${token.colorPrimary};
        }
    `,
    card: css`
        display: flex;
        flex-direction: column;
        cursor: pointer;
    `,
    cardCover: css`
        position: relative;
        height: 0;
        padding-top: 150%;
        overflow: hidden;
        border-radius: 12px;
        background-color: ${token.colorBgContainer};
        box-shadow: var(--shadow-border-light);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        &:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-card);
        }
        &:hover img {
            transform: scale(1.08);
        }
        &:hover .card-play {
            opacity: 1;
        }
    `,
    cardPic: css`
        position: absolute !important;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
    `,
    cardBadge: css`
        position: absolute;
        right: 8px;
        bottom: 8px;
        z-index: 1;
        pointer-events: none;
        color: #fff;
        font-weight: 600;
        background: var(--color-overlay);
        backdrop-filter: blur(8px);
        border-radius: 6px;
        padding: 3px 8px;
        font-size: 11px;
        border: 1px solid var(--color-overlay-border);
    `,
    cardPlay: css`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 44px;
        height: 44px;
        background: ${token.colorPrimary};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;
        backdrop-filter: blur(8px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        svg {
            margin-left: 2px;
        }
    `,
    cardInfo: css`
        margin-top: 10px;
        width: 100%;
    `,
    cardTitle: css`
        text-align: left;
        font-size: 13px;
        font-weight: 500;
        display: block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: ${token.colorTextSecondary};
        line-height: 1.4;
        transition: color 0.2s;
        &:hover {
            color: ${token.colorText};
        }
    `,
    cardExtra: css`
        font-size: 12px;
        color: ${token.colorTextTertiary};
        margin-top: 2px;
    `
}));
