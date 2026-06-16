import { Layout } from 'antd';
import dayjs from 'dayjs';
import { Outlet } from 'react-router';

import { useStyles } from './basicLayoutStyles';

import Disclaimer from '@/components/Disclaimer';

const { Footer } = Layout;

const BasicLayout = () => {
    const { styles } = useStyles();

    return (
        <Layout className={styles.layout}>
            <Disclaimer />
            <Outlet />
            <Footer className={styles.footer}>
                <span>©{dayjs().year()} VodNext</span>
                <span className={styles.footerDivider}>|</span>
                <span>仅供学习交流使用</span>
            </Footer>
        </Layout>
    );
};

export default BasicLayout;
