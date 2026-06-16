import { Layout } from 'antd';
import { Outlet } from 'react-router';

import { useStyles } from './cmsPageLayoutStyles';

import SiteHeader from '@/components/SiteHeader';
import VodTypes from '@/components/VodTypes';
import useSettingStore from '@/store/useSettingStore';

const { Content } = Layout;

const CmsPageLayout = () => {
    const { current_site } = useSettingStore();
    const { styles } = useStyles();

    return (
        <>
            <SiteHeader />
            <VodTypes site={current_site} />
            <Content className={styles.content}>
                <div className={styles.main}>
                    <Outlet />
                </div>
            </Content>
        </>
    );
};

export default CmsPageLayout;
