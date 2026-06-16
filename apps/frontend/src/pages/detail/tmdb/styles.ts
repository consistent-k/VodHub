import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
    page: css`
        height: 100%;
        width: 100%;
        padding-bottom: 24px;
    `,
    content: css`
        display: flex;
        flex-direction: column;
        gap: 16px;
    `
}));
