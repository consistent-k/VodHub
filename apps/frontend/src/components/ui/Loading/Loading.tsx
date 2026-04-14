import { useEffect, useState } from 'react';

import styles from './index.module.scss';

interface LoadingProps {
    fullscreen?: boolean;
    description?: string;
    size?: 'small' | 'default' | 'large';
}

const Loading: React.FC<LoadingProps> = ({ fullscreen = false, description = '加载中', size = 'default' }) => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
        }, 400);
        return () => clearInterval(interval);
    }, []);

    const sizeClasses = {
        small: styles['size-small'],
        default: styles['size-default'],
        large: styles['size-large']
    };

    const content = (
        <div className={`${styles['loading-container']} ${fullscreen ? styles['fullscreen'] : ''}`}>
            <div className={styles['loading-content']}>
                <div className={`${styles['spinner']} ${sizeClasses[size]}`}>
                    <div className={styles['spinner-ring']} />
                    <div className={styles['spinner-ring']} />
                    <div className={styles['spinner-ring']} />
                </div>
                {description && (
                    <div className={styles['loading-text']}>
                        {description}
                        <span className={styles['dots']}>{dots}</span>
                    </div>
                )}
            </div>
        </div>
    );

    return content;
};

export default Loading;
