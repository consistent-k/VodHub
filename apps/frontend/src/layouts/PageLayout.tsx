import { Layout } from 'antd';
import { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router';

import { useStyles } from './pageLayoutStyles';

import SiteHeader from '@/components/SiteHeader';

const { Content } = Layout;

const PageLayout = () => {
    const { styles } = useStyles();
    const location = useLocation();

    const isSettingPage = useMemo(() => {
        return location.pathname === '/setting';
    }, [location.pathname]);

    return (
        <>
            {!isSettingPage && <SiteHeader />}
            <Content className={styles.content}>
                <div className={styles.main}>
                    <Outlet />
                </div>
            </Content>
        </>
    );
};

export default PageLayout;
