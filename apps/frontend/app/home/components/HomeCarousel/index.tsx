'use client';
import { Carousel, Grid, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import React, { Fragment } from 'react';

import { HomeVodData } from '@/lib/types';

const { Title } = Typography;
const { useBreakpoint } = Grid;

interface HomeCarouselProps {
    dataSource: HomeVodData[];
    site: string;
}

const HomeCarousel: React.FC<HomeCarouselProps> = (props) => {
    const { dataSource, site } = props;
    const router = useRouter();

    const screens = useBreakpoint();

    return (
        <Carousel
            autoplay
            arrows
            dots
            fade
            style={{
                height: screens.xs ? '200px' : '400px',
                marginTop: 20
            }}
        >
            {dataSource.map((item, index) => {
                return (
                    <Fragment key={`carousel-${item.vod_id}-${index.toString()}`}>
                        <div
                            style={{
                                height: screens.xs ? '200px' : '400px',
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                position: 'relative',
                                background: `url(${item.vod_pic_thumb || item.vod_pic}) center no-repeat`,
                                backgroundSize: 'cover',
                                borderRadius: 8,
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                router.push(`/detail?id=${item.vod_id}&site=${site}`);
                            }}
                        >
                            <Title
                                style={{
                                    alignSelf: 'end',
                                    position: 'absolute',
                                    bottom: 10,
                                    zIndex: 20,
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontFamily: 'Microsoft YaHei',
                                    cursor: 'pointer',
                                    fontSize: screens.xs ? 16 : 24
                                }}
                            >
                                {item.vod_name}
                            </Title>
                        </div>
                    </Fragment>
                );
            })}
        </Carousel>
    );
};

export default HomeCarousel;
