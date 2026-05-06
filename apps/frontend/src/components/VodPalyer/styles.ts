import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
    player: css`
        width: 100%;
        aspect-ratio: 16 / 9;
        margin-bottom: 16px;
        border-radius: 16px;
        box-shadow: var(--shadow-border);
        border: none;
    `
}));
