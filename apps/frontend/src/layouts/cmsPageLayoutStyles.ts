import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
    content: css`
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 0;
    `,
    main: css`
        flex: 1;
        padding: 24px;
        overflow-y: auto;
    `
}));
