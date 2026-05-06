import { Layout } from 'antd';
import dayjs from 'dayjs';
import React, { PropsWithChildren, useMemo } from 'react';
import { useLocation } from 'react-router';

import { useStyles } from './styles';

import Disclaimer from '@/components/Disclaimer';
import SiteHeader from '@/components/SiteHeader';
import VodTypes from '@/components/VodTypes';
import useAppConfigStore from '@/store/useAppConfigStore';
import useSettingStore from '@/store/useSettingStore';

const { Content, Footer } = Layout;

interface BasicLayoutProps {
    isSettingPage?: boolean;
}

const BasicLayout: React.FC<PropsWithChildren<BasicLayoutProps>> = ({ children, isSettingPage = false }) => {
    const location = useLocation();
    const { styles } = useStyles();

    const { current_site, tmdb_view_cms } = useSettingStore();
    const { tmdb_enabled } = useAppConfigStore();
    const isTmdbView = tmdb_enabled && !tmdb_view_cms;

    const isHomePage = useMemo(() => {
        return location.pathname === '/home';
    }, [location.pathname]);

    const isCategoryPage = useMemo(() => {
        return location.pathname === '/category';
    }, [location.pathname]);

    const showVodTypes = useMemo(() => {
        return (isHomePage || isCategoryPage) && !isTmdbView;
    }, [isHomePage, isCategoryPage, isTmdbView]);

    return (
        <Layout className={styles.layout}>
            <Disclaimer></Disclaimer>
            {!isSettingPage && <SiteHeader></SiteHeader>}
            <Content className={styles.content}>
                {showVodTypes && <VodTypes site={current_site}></VodTypes>}
                <div className={styles.main}>{children}</div>
            </Content>
            <Footer className={styles.footer}>
                <span>©{dayjs().year()} VodNext</span>
                <span className={styles.footerDivider}>|</span>
                <span>仅供学习交流使用</span>
            </Footer>
        </Layout>
    );
};

export default BasicLayout;
