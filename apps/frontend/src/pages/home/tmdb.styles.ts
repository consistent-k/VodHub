import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
    home: css`
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 40px;
    `,
    empty: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        gap: 16px;
        color: ${token.colorTextTertiary};
    `
}));
