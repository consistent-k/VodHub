'use client';
import { useDeepCompareEffect, useUnmount } from 'ahooks';
import { useRef } from 'react';
import Player, { I18N } from 'xgplayer';
import ZH from 'xgplayer/es/lang/zh-cn';
import HlsPlugin from 'xgplayer-hls';

import styles from './index.module.scss';
import 'xgplayer/dist/index.min.css';

// eslint-disable-next-line react-hooks/rules-of-hooks
I18N.use(ZH);

export interface PalyerProps {
    showType?: 'xgplayer' | 'iframe';
    url: string;
    style?: React.CSSProperties;
    onError?: (error: string) => void;
}

const VodPalyer: React.FC<PalyerProps> = (props) => {
    const { url, onError, style, showType = 'xgplayer' } = props;

    const xgInstanceRef = useRef<any>(null);

    useDeepCompareEffect(() => {
        if (!url) {
            return;
        }
        if (showType === 'iframe') {
            return;
        }
        const player = new Player({
            id: 'xgplayer',
            url,
            height: '100%',
            width: '100%',
            autoplay: true,
            playsinline: true,
            plugins: [HlsPlugin],
            hls: {
                retryCount: 3, // 重试 3 次，默认值
                retryDelay: 1000, // 每次重试间隔 1 秒，默认值
                loadTimeout: 10000, // 请求超时时间为 10 秒，默认值
                fetchOptions: {
                    // 该参数会透传给 fetch，默认值为 undefined
                    mode: 'cors'
                }
            }
        });
        player.on('error', (e: any) => {
            onError?.(e.message);
        });
    }, [url, showType]);

    useUnmount(() => {
        if (xgInstanceRef.current) {
            xgInstanceRef.current.destroy();
            xgInstanceRef.current = null;
        }
    });

    return (
        <div className={styles['vod-next-player']} style={{ ...style }}>
            {showType === 'xgplayer' ? (
                <div
                    id="xgplayer"
                    style={{
                        height: '100%',
                        width: '100%'
                    }}
                ></div>
            ) : (
                <iframe src={url} frameBorder="0" width="100%" height="100%" allowFullScreen={true} />
            )}
        </div>
    );
};

export default VodPalyer;
