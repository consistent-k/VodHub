import { SettingOutlined } from '@ant-design/icons';
import { Button, Flex, Layout } from 'antd';
import { useNavigate } from 'react-router';

import styles from './index.module.scss';

import VodSearch from '@/components/video/VodSearch';
import VodSites from '@/components/video/VodSites';
import useSettingStore from '@/lib/store/useSettingStore';
import { useVodSitesStore } from '@/lib/store/useVodSitesStore';

const { Header } = Layout;

const SiteHeader = () => {
    const navigate = useNavigate();

    const { current_site, setting, updateSetting } = useSettingStore();

    const { site_name } = useSettingStore();

    const { sites } = useVodSitesStore();

    return (
        <Header className={styles['vod-header']}>
            <Flex gap={20} align="center">
                <Flex
                    className={styles['vod-header-logo']}
                    onClick={() => {
                        navigate('/home');
                    }}
                    align="center"
                    gap={10}
                >
                    <div className={styles['vod-header-logo-icon']}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 8L15 12L9 16V8Z" fill="currentColor" />
                        </svg>
                    </div>
                    <span className={styles['vod-header-title']}>{site_name || 'VodNext'}</span>
                </Flex>
                <VodSites
                    options={sites}
                    value={current_site}
                    onChange={(value) => {
                        updateSetting({ ...setting, current_site: value });
                        navigate('/home');
                    }}
                />
            </Flex>
            <Flex gap={8} align="center">
                <VodSearch site={current_site} />
                <Button
                    type="text"
                    className={styles['vod-header-btn']}
                    icon={<SettingOutlined />}
                    onClick={() => {
                        navigate('/setting');
                    }}
                />
            </Flex>
        </Header>
    );
};

export default SiteHeader;
