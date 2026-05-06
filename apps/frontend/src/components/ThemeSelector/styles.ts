import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    card: css`
        transition: all 0.2s ease;
        border: 2px solid transparent;
        &:hover {
            transform: translateY(-2px);
        }
    `,
    cardSelected: css`
        border-color: ${token.colorPrimary};
        box-shadow: 0 0 0 2px ${token.colorPrimaryBg};
    `,
    check: css`
        position: absolute;
        top: 8px;
        right: 8px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: ${token.colorPrimary};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        z-index: 1;
    `,
    preview: css`
        border: 1px solid ${token.colorBorderSecondary};
    `
}));
