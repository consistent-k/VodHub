import { Col, Image, Row } from 'antd';

import styles from './index.module.scss';

import { CategoryVodData, HomeVodData, SearchData } from '@/lib/types';

export interface VodListProps {
    dataSource: HomeVodData[] | SearchData[] | CategoryVodData[];
    onItemClick?: (vod: HomeVodData | SearchData | CategoryVodData) => void;
}

const VodList: React.FC<VodListProps> = (props) => {
    const { dataSource = [], onItemClick } = props;

    if (dataSource.length === 0) {
        return null;
    }

    return (
        <div className={styles['vod-list-container']}>
            <Row gutter={[20, 20]}>
                {dataSource.map((vod, index) => {
                    return (
                        <Col key={`vod-${vod.vod_id}-${index.toString()}`} xs={12} sm={8} md={6} lg={4} xl={4}>
                            <div
                                className={styles['vod-list-item']}
                                onClick={() => {
                                    onItemClick?.(vod);
                                }}
                            >
                                <div className={styles['vod-list-item-cover']}>
                                    {vod.vod_remarks && <div className={styles['vod-list-item-cover-remarks']}>{vod.vod_remarks}</div>}
                                    <div className={styles['vod-list-item-cover-play']}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 5V19L19 12L8 5Z" fill="white" />
                                        </svg>
                                    </div>
                                    <Image
                                        rootClassName={styles['vod-list-item-cover-pic']}
                                        src={vod.vod_pic}
                                        referrerPolicy="no-referrer"
                                        alt={vod.vod_name}
                                        preview={false}
                                        style={{
                                            objectFit: 'cover',
                                            height: '100%',
                                            width: '100%'
                                        }}
                                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAQMAAADOtka5AAAABlBMVEX///8AAABVwtN+AAAAAXRSTlMAQObYZgAAAAlwShavanJqcGAAAAyRJREFUeNrtwQEBAAAAgiD/r25IQAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfBp4DwABPq7bWwAAAABJRU5ErkJggg=="
                                    ></Image>
                                </div>
                                <div className={styles['vod-list-item-info']}>
                                    <div className={styles['vod-list-item-info-title']}>{vod.vod_name}</div>
                                </div>
                            </div>
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
};

export default VodList;
