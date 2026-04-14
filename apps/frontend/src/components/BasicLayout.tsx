import { Layout } from 'antd';
import dayjs from 'dayjs';
import React, { PropsWithChildren, useMemo } from 'react';
import { useLocation } from 'react-router';
import styles from './BasicLayout.module.scss';
import Disclaimer from './Disclaimer';
import SiteHeader from './SiteHeader';
import VodTypes from '@/components/video/VodTypes';
import useSettingStore from '@/lib/store/useSettingStore';
const { Content, Footer } = Layout;

interface BasicLayoutProps {
    isSettingPage?: boolean;
}

const BasicLayout: React.FC<PropsWithChildren<BasicLayoutProps>> = ({ children, isSettingPage = false }) => {
    const location = useLocation();

    const { current_site } = useSettingStore();

    const isHomePage = useMemo(() => {
        return location.pathname === '/home';
    }, [location.pathname]);

    const isCategoryPage = useMemo(() => {
        return location.pathname === '/category';
    }, [location.pathname]);

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
