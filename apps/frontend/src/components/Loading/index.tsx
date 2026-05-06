import { useEffect, useState } from 'react';

import { useStyles } from './styles';

interface LoadingProps {
    fullscreen?: boolean;
    description?: string;
    size?: 'small' | 'default' | 'large';
}

const Loading: React.FC<LoadingProps> = ({ fullscreen = false, description = '加载中', size = 'default' }) => {
    const [dots, setDots] = useState('');
    const { styles, cx } = useStyles();

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
        }, 400);
        return () => clearInterval(interval);
    }, []);

    const sizeClasses = {
        small: styles.sizeSmall,
        default: styles.sizeDefault,
        large: styles.sizeLarge
    };

    return (
        <div className={cx(styles.container, fullscreen && styles.fullscreen)}>
            <div className={styles.content}>
                <div className={cx(styles.spinner, sizeClasses[size])}>
                    <div className={styles.spinnerRing} />
                    <div className={styles.spinnerRing} />
                    <div className={styles.spinnerRing} />
                </div>
                {description && (
                    <div className={styles.loadingText}>
                        {description}
                        <span className={styles.dots}>{dots}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Loading;
