import { Form, Input, Button, Flex, App, Card, Typography, Space } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router';

import { useStyles } from './styles';

import CmsManagement from '@/components/CmsManagement';
import { ThemeSelector } from '@/components/ThemeSelector';
import useSettingStore from '@/store/useSettingStore';

const { Text } = Typography;

const SettingPage: React.FC = () => {
    const { site_name, updateSetting } = useSettingStore();
    const [form] = Form.useForm();
    const { styles } = useStyles();

    const { message } = App.useApp();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            await form.validateFields();
            const values = form.getFieldsValue(true);

            updateSetting(values);
            message.success('保存配置成功');
            navigate('/home');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.setting}>
            <div className={styles.page}>
                <Flex gap={24} vertical>
                    {/* 操作按钮 */}
                    <Card
                        className={styles.card}
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
                        className={styles.card}
                        styles={{
                            body: { padding: '24px' }
                        }}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={{
                                site_name: site_name || 'VodNext'
                            }}
                            autoComplete="off"
                        >
                            <Form.Item
                                label={<Text style={{ fontWeight: 500, color: 'var(--color-text-secondary)' }}>网站名称</Text>}
                                name="site_name"
                                rules={[{ required: true, message: '请输入网站名称' }]}
                            >
                                <Input
                                    placeholder="请输入网站名称"
                                    style={{
                                        width: 280,
                                        height: 40
                                    }}
                                />
                            </Form.Item>
                        </Form>

                        <Flex vertical gap={12}>
                            <Text style={{ fontWeight: 500, color: 'var(--color-text-secondary)' }}>主题设置</Text>
                            <ThemeSelector />
                        </Flex>
                    </Card>
                    {/* CMS地址管理 */}
                    <Card
                        title={
                            <Flex align="center" gap={8}>
                                <span style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.32px' }}>CMS地址管理</span>
                            </Flex>
                        }
                        className={styles.card}
                        styles={{
                            body: { padding: '24px' }
                        }}
                    >
                        <CmsManagement />
                    </Card>
                </Flex>
            </div>
        </div>
    );
};

export default SettingPage;
