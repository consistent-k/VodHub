import { useDeepCompareEffect, useUnmount } from 'ahooks';
import CryptoJS from 'crypto-js';
import { useMemo, useRef } from 'react';
import Player, { I18N } from 'xgplayer';
import ZH from 'xgplayer/es/lang/zh-cn';
import HlsPlugin from 'xgplayer-hls';

import 'xgplayer/dist/index.min.css';

import { useStyles } from './styles';

// eslint-disable-next-line react-hooks/rules-of-hooks
I18N.use(ZH);

function uint8ArrayToWordArray(data: Uint8Array) {
    const words: number[] = [];
    for (let i = 0; i < data.length; i += 4) {
        words.push((data[i] << 24) | (data[i + 1] << 16) | (data[i + 2] << 8) | (data[i + 3] << 0));
    }
    return CryptoJS.lib.WordArray.create(words, data.length);
}

function wordArrayToUint8Array(wordArray: CryptoJS.lib.WordArray) {
    const result = new Uint8Array(wordArray.sigBytes);
    for (let i = 0; i < wordArray.sigBytes; i++) {
        result[i] = (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }
    return result;
}

function toUint8Array(buf: ArrayBuffer | ArrayBufferView) {
    if (buf instanceof ArrayBuffer) return new Uint8Array(buf);
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
}

interface ExternalDecryptor {
    decrypt(data: Uint8Array, key: ArrayBuffer | ArrayBufferView, iv: ArrayBuffer | ArrayBufferView): Promise<Uint8Array>;
}

const createExternalDecryptor = (): ExternalDecryptor => ({
    async decrypt(data: Uint8Array, key: ArrayBuffer | ArrayBufferView, iv: ArrayBuffer | ArrayBufferView) {
        const keyWA = uint8ArrayToWordArray(toUint8Array(key));
        const ivWA = uint8ArrayToWordArray(toUint8Array(iv));
        const dataWA = uint8ArrayToWordArray(data);

        const cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: dataWA
        });

        const decrypted = CryptoJS.AES.decrypt(cipherParams, keyWA, {
            iv: ivWA,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return wordArrayToUint8Array(decrypted);
    }
});

export interface PlayerProps {
    showType?: 'xgplayer' | 'iframe';
    url: string;
    style?: React.CSSProperties;
    onError?: (error: string) => void;
}

const VodPalyer: React.FC<PlayerProps> = (props) => {
    const { url, onError, style, showType = 'xgplayer' } = props;
    const { styles } = useStyles();

    const xgInstanceRef = useRef<any>(null);

    const needsExternalDecryptor = useMemo(() => typeof window !== 'undefined' && (!window.crypto || !window.crypto.subtle), []);

    const hlsConfig = useMemo(
        () => ({
            retryCount: 3,
            retryDelay: 1000,
            loadTimeout: 10000,
            maxBufferLength: 120,
            maxMaxBufferLength: 300,
            startFragPrefetch: true,
            enableWorker: true,
            lowLatencyMode: false,
            backbufferLength: 60,
            fetchOptions: {
                mode: 'cors'
            },
            ...(needsExternalDecryptor ? { decryptor: createExternalDecryptor() } : {})
        }),
        [needsExternalDecryptor]
    );

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
            isLive: false,
            preloadTime: 60,
            plugins: [HlsPlugin],
            hls: hlsConfig
        });
        xgInstanceRef.current = player;
        player.on('error', (e: any) => {
            onError?.(e.message);
        });

        return () => {
            player.destroy();
            if (xgInstanceRef.current === player) {
                xgInstanceRef.current = null;
            }
        };
    }, [url, showType, hlsConfig]);

    useUnmount(() => {
        if (xgInstanceRef.current) {
            xgInstanceRef.current.destroy();
            xgInstanceRef.current = null;
        }
    });

    return (
        <div className={styles.player} style={{ ...style }}>
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
