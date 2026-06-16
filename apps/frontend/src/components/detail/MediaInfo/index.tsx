import { Descriptions, Typography } from 'antd';
import React from 'react';

import { useStyles } from './styles';

import AiSummary from '@/components/AiSummary';
import useIsMobile from '@/hooks/useIsMobile';
import type { DetailData } from '@/types';

const { Paragraph } = Typography;

interface MediaInfoProps {
    detail: DetailData;
}

const MediaInfo: React.FC<MediaInfoProps> = ({ detail }) => {
    const { styles } = useStyles();
    const { isMobile } = useIsMobile();

    return (
        <div className={styles.wrapper}>
            <Descriptions
                title={<div>{detail.vod_name}</div>}
                column={1}
                styles={{
                    label: {
                        minWidth: 80
                    }
                }}
            >
                <Descriptions.Item label="简介">
                    <Paragraph ellipsis={{ rows: isMobile ? 8 : 10, expandable: false }}>{detail.vod_content.trimStart()}</Paragraph>
                </Descriptions.Item>
                {isMobile && (
                    <>
                        <Descriptions.Item label="导演">{detail.vod_director}</Descriptions.Item>
                        <Descriptions.Item label="上映日期">{detail.vod_year}</Descriptions.Item>
                        <Descriptions.Item label="地区">{detail.vod_area}</Descriptions.Item>
                    </>
                )}
                <Descriptions.Item label="演员">
                    <Paragraph ellipsis={{ rows: isMobile ? 5 : 10, expandable: false }}>{detail.vod_actor}</Paragraph>
                </Descriptions.Item>
                {!isMobile && (
                    <>
                        <Descriptions.Item label="导演">{detail.vod_director}</Descriptions.Item>
                        <Descriptions.Item label="上映日期">{detail.vod_year}</Descriptions.Item>
                        <Descriptions.Item label="地区">{detail.vod_area}</Descriptions.Item>
                    </>
                )}
            </Descriptions>
            {detail.vod_content && (
                <AiSummary title={detail.vod_name} content={detail.vod_content} year={detail.vod_year} area={detail.vod_area} actor={detail.vod_actor} director={detail.vod_director} />
            )}
        </div>
    );
};

export default MediaInfo;
