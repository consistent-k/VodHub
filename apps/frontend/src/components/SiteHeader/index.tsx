import { AppstoreOutlined, SettingOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Flex, Layout, Tooltip } from 'antd';
import { useNavigate } from 'react-router';

import { useStyles } from './styles';

import VodSearch from '@/components/VodSearch';
import VodSites from '@/components/VodSites';
import useAppConfigStore from '@/store/useAppConfigStore';
import useSettingStore from '@/store/useSettingStore';
import { useVodSitesStore } from '@/store/useVodSitesStore';

const { Header } = Layout;

const SiteHeader = () => {
    const navigate = useNavigate();
    const { styles } = useStyles();

    const { vod_hub_api, site_name, current_site, tmdb_view_cms, updateSetting } = useSettingStore();
    const { tmdb_enabled, tmdb_api_token } = useAppConfigStore();

    const { sites } = useVodSitesStore();

    const showTmdbToggle = !!vod_hub_api && !!tmdb_api_token;
    const isTmdbView = tmdb_enabled && !tmdb_view_cms;

    return (
        <Header className={styles.header}>
            <Flex gap={20} align="center">
                <Flex
                    className={styles.logo}
                    onClick={() => {
                        navigate('/home');
                    }}
                    align="center"
                    gap={10}
                >
                    <div className={styles.logoIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 8L15 12L9 16V8Z" fill="currentColor" />
                        </svg>
                    </div>
                    <span className={styles.title}>{site_name || 'VodNext'}</span>
                </Flex>
                {!isTmdbView && (
                    <VodSites
                        options={sites}
                        value={current_site}
                        onChange={(value) => {
                            updateSetting({ vod_hub_api, site_name, current_site: value });
                            navigate('/home');
                        }}
                    />
                )}
            </Flex>
            <Flex gap={8} align="center">
                {showTmdbToggle && (
                    <Tooltip title={isTmdbView ? '切换到 CMS' : '切换到 TMDB'}>
                        <Button
                            type="text"
                            className={styles.btn}
                            icon={isTmdbView ? <AppstoreOutlined /> : <VideoCameraOutlined />}
                            onClick={() => {
                                updateSetting({ tmdb_view_cms: !tmdb_view_cms });
                                navigate('/home');
                            }}
                        />
                    </Tooltip>
                )}
                <VodSearch site={current_site} />
                <Button
                    type="text"
                    className={styles.btn}
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
