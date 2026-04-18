import { Form, Input, Button, Flex, Select, App, Card, Typography, Space } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

import styles from './index.module.scss';

import CmsManagement from '@/components/cms-management';
import { ThemeSelector } from '@/components/ui/ThemeSelector';
import useSettingStore from '@/lib/store/useSettingStore';
import { useVodSitesStore } from '@/lib/store/useVodSitesStore';

const { Text } = Typography;

const SettingPage: React.FC = () => {
    const { vod_hub_api, site_name, current_site, updateSetting } = useSettingStore();
    const [form] = Form.useForm();

    const { getVodTypes, sites, isInitialized, hasError, clearVodTypes } = useVodSitesStore();

    const { message } = App.useApp();
    const navigate = useNavigate();

    // 同步 current_site 变化到表单
    useEffect(() => {
        form.setFieldValue('current_site', current_site || '');
    }, [current_site, form]);

    const handleSubmit = async () => {
        try {
            if (!isInitialized) {
                message.warning('请先点击测试接口后保存配置');
                return;
            }

            if (hasError) {
                message.warning('VodHub API 配置错误，请修改后重新点击接口测试');
                return;
            }

            await form.validateFields();
            const values = form.getFieldsValue(true);

            updateSetting(values);
            message.success('保存配置成功');
            navigate('/home');
        } catch (error) {
            console.error(error);
        }
    };

    const handleApiChange = async () => {
        const apiValue = form.getFieldValue('vod_hub_api');
        if (!apiValue) {
            message.warning('请输入 API 地址');
            return;
        }

        updateSetting({ vod_hub_api: apiValue, site_name, current_site: '' });
        form.setFieldValue('current_site', '');
        clearVodTypes();

        try {
            await getVodTypes();
            message.success('API 地址验证成功');
        } catch (error) {
            console.error(error);
            message.error('验证接口失败');
        }
    };

    return (
        <div className={styles['vod-next-setting']}>
            <div className={styles['setting-page']}>
                <Flex gap={24} vertical>
                    {/* 操作按钮 */}
                    <Card
                        className={styles['setting-card']}
                        styles={{
                            body: { padding: '24px' }
                        }}
                    >
                        <Flex justify="space-between" align="center">
                            <Button
                                onClick={() => navigate('/home')}
                                style={{
                                    fontWeight: 500
                                }}
                            >
                                返回首页
                            </Button>

                            <Space>
                                <Button
                                    onClick={() => form.resetFields()}
                                    style={{
                                        fontWeight: 500
                                    }}
                                >
                                    重置
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={handleSubmit}
                                    style={{
                                        fontWeight: 500
                                    }}
                                >
                                    保存配置
                                </Button>
                            </Space>
                        </Flex>
                    </Card>
                    {/* 基础配置卡片 */}
                    <Card
                        title={
                            <Flex align="center" gap={8}>
                                <span style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.32px' }}>基础配置</span>
                            </Flex>
                        }
                        className={styles['setting-card']}
                        styles={{
                            body: { padding: '24px' }
                        }}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={{
                                site_name: site_name || 'VodNext',
                                vod_hub_api: vod_hub_api || '/',
                                current_site: ''
                            }}
                            onValuesChange={(changedValues) => {
                                if ('current_site' in changedValues) {
                                    if (changedValues.current_site) {
                                        updateSetting({ vod_hub_api, site_name, current_site: changedValues.current_site });
                                    }
                                }
                            }}
                        >
                            <Flex gap={24} wrap="wrap">
                                <Form.Item
                                    label={<Text style={{ fontWeight: 500, color: 'var(--color-text-secondary)' }}>网站名称</Text>}
                                    name="site_name"
                                    rules={[{ required: true, message: '请输入网站名称' }]}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Input
                                        placeholder="请输入网站名称"
                                        style={{
                                            width: 280
                                        }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<Text style={{ fontWeight: 500, color: 'var(--color-text-secondary)' }}>VodHub API 地址</Text>}
                                    name="vod_hub_api"
                                    rules={[
                                        {
                                            validator: (_, value) => {
                                                if (!value) {
                                                    return Promise.reject('请输入 API 地址');
                                                }
                                                if (value.startsWith('/') || /^https?:\/\//.test(value)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('请输入正确的 URL 或以 / 开头的路径');
                                            }
                                        }
                                    ]}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Flex gap={8} align="flex-end">
                                        <Input
                                            placeholder="请输入 VodHub API 地址"
                                            style={{
                                                width: 280
                                            }}
                                        />
                                        <Button
                                            type="default"
                                            onClick={handleApiChange}
                                            style={{
                                                height: '32px',
                                                fontWeight: 500
                                            }}
                                        >
                                            验证
                                        </Button>
                                    </Flex>
                                </Form.Item>
                            </Flex>
                        </Form>
                    </Card>
                    {/* CMS地址管理 */}
                    <Card
                        title={
                            <Flex align="center" gap={8}>
                                <span style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.32px' }}>CMS地址管理</span>
                            </Flex>
                        }
                        className={styles['setting-card']}
                        styles={{
                            body: { padding: '24px' }
                        }}
                    >
                        <CmsManagement />
                    </Card>

                    {/* 站点选择卡片 */}
                    <Card
                        title={
                            <Flex align="center" gap={8}>
                                <span style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.32px' }}>站点选择</span>
                            </Flex>
                        }
                        className={styles['setting-card']}
                        styles={{
                            body: { padding: '24px' }
                        }}
                    >
                        <Form form={form}>
                            <Flex gap={24} vertical>
                                <Form.Item label={<Text style={{ fontWeight: 500, color: 'var(--color-text-secondary)' }}>默认资源站点</Text>} name="current_site" style={{ marginBottom: 0 }}>
                                    <Select options={sites} style={{ width: 280 }} placeholder="请选择默认站点" />
                                </Form.Item>

                                {!isInitialized && (
                                    <Flex gap={8} align="center">
                                        <Text type="secondary" style={{ fontSize: '14px' }}>
                                            请先验证 API 地址以获取站点列表
                                        </Text>
                                    </Flex>
                                )}
                            </Flex>
                        </Form>
                    </Card>

                    {/* 主题选择器 */}
                    <Card
                        title={
                            <Flex align="center" gap={8}>
                                <span style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.32px' }}>主题设置</span>
                            </Flex>
                        }
                        className={styles['setting-card']}
                        styles={{
                            body: { padding: '24px' }
                        }}
                    >
                        <ThemeSelector />
                    </Card>
                </Flex>
            </div>
        </div>
    );
};

export default SettingPage;
