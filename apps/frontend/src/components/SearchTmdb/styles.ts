import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    results: css`
        height: calc(100% - 60px);
        overflow-y: auto;
        padding: 0 16px 16px;
    `,
    loading: css`
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 200px;
    `,
    count: css`
        font-size: 13px;
        color: ${token.colorTextTertiary};
        margin-bottom: 12px;
    `,
    empty: css`
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 200px;
        color: ${token.colorTextTertiary};
        font-size: 14px;
    `,
    grid: css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
        gap: 16px;
    `,
    item: css`
        cursor: pointer;
    `,
    itemCover: css`
        position: relative;
        height: 0;
        padding-top: 150%;
        overflow: hidden;
        border-radius: 10px;
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
    `,
    itemPic: css`
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
    itemType: css`
        position: absolute;
        top: 6px;
        left: 6px;
        z-index: 1;
        font-size: 11px;
        font-weight: 600;
    `,
    itemScore: css`
        position: absolute;
        top: 6px;
        right: 6px;
        z-index: 1;
        background: var(--color-overlay);
        backdrop-filter: blur(8px);
        border-radius: 6px;
        padding: 2px 6px;
        font-size: 11px;
        font-weight: 600;
        color: #fff;
        border: 1px solid var(--color-overlay-border);
    `,
    itemMatching: css`
        position: absolute;
        inset: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-overlay);
    `,
    itemInfo: css`
        margin-top: 8px;
    `,
    itemTitle: css`
        text-align: left;
        font-size: 13px;
        font-weight: 500;
        display: block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: ${token.colorTextSecondary};
        line-height: 1.4;
        &:hover {
            color: ${token.colorText};
        }
    `,
    itemMeta: css`
        display: flex;
        gap: 8px;
        font-size: 12px;
        color: ${token.colorTextTertiary};
        margin-top: 2px;
    `,
    mobileOverlay: css`
        position: fixed;
        inset: 0;
        width: 100dvw;
        height: 100dvh;
        display: flex;
        flex-direction: column;
        background-color: ${token.colorBgLayout};
        z-index: 1000;
    `
}));
