'use client';
import { Layout } from 'antd';
import dayjs from 'dayjs';
import { usePathname } from 'next/navigation';
import React, { PropsWithChildren, useMemo } from 'react';

import styles from './BasicLayout.module.scss';
import Disclaimer from './components/Disclaimer';
import SiteHeader from './components/SiteHeader';

import VodTypes from '@/components/video/VodTypes';
import useSettingStore from '@/lib/store/useSettingStore';
const { Content, Footer } = Layout;

const BasicLayout: React.FC<PropsWithChildren> = ({ children }) => {
    const pathname = usePathname();

    const { current_site } = useSettingStore();

    // 是否是配置页面
    const isSettingPage = useMemo(() => {
        return pathname === '/setting';
    }, [pathname]);

    // 是否是首页
    const isHomePage = useMemo(() => {
        return pathname === '/home';
    }, [pathname]);

    // 是否是分类页面
    const isCategoryPage = useMemo(() => {
        return pathname === '/category';
    }, [pathname]);

    // 是否展示分类
    const showVodTypes = useMemo(() => {
        return isHomePage || isCategoryPage;
    }, [isHomePage, isCategoryPage]);

    return (
        <Layout className={styles['vod-layout']}>
            <Disclaimer></Disclaimer>
            {!isSettingPage && <SiteHeader></SiteHeader>}
            <Content className={styles['vod-layout-content']}>
                {showVodTypes && <VodTypes site={current_site}></VodTypes>}
                <div className={styles['vod-layout-main']}>{children}</div>
            </Content>
            <Footer className={styles['vod-layout-footer']}>
                <span>©{dayjs().year()} VodNext</span>
                <span className={styles['vod-layout-footer-divider']}>|</span>
                <span>仅供学习交流使用</span>
            </Footer>
        </Layout>
    );
};

export default BasicLayout;
