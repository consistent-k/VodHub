import { InfoCircleOutlined } from '@ant-design/icons';
import { Form, Input, Button, Flex, Select, App, Steps, Descriptions, Divider } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './index.module.scss';
import { ThemeSelector } from '@/components/ui/ThemeSelector';
import useSettingStore from '@/lib/store/useSettingStore';
import { useVodSitesStore } from '@/lib/store/useVodSitesStore';

const SettingPage: React.FC = () => {
    const { vod_hub_api, site_name, setting, updateSetting } = useSettingStore();
    const [form] = Form.useForm();

    const { getVodTypes, sites, isInitialized, hasError, clearVodTypes } = useVodSitesStore();

    const [current, setCurrent] = useState(0);

    const { message } = App.useApp();
    const navigate = useNavigate();

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

    const next = async () => {
        try {
            await form.validateFields();
            setCurrent(current + 1);
        } catch (error) {
            console.log('验证失败:', error);
        }
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const steps = [
        {
            title: '基础设置',
            content: (
                <>
                    <Form.Item label="网站名称" required name="site_name" rules={[{ required: true, message: '请输入网站名称' }]}>
                        <Input
                            placeholder="请输入网站名称"
                            style={{
                                width: 300
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="VodHub API 地址"
                        tooltip={{
                            title: (
                                <span>
                                    支持完整的 HTTP(S) URL 或以 / 开头的相对路径
                                    <Button type="link" onClick={() => window.open('https://github.com/consistent-k/VodHub', '_blank')} style={{ padding: '0 0 0 8px' }}>
                                        查看文档
                                    </Button>
                                </span>
                            ),
                            icon: <InfoCircleOutlined />
                        }}
                        required
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
                    >
                        <Input
                            placeholder="请输入 VodHub API 地址"
                            style={{
                                width: 300
                            }}
                        />
                    </Form.Item>
                </>
            ),
            buttons: (
                <>
                    <Button
                        type="primary"
                        onClick={() => {
                            updateSetting({ ...setting, vod_hub_api: form.getFieldValue('vod_hub_api'), current_site: '' });
                            form.setFieldValue('current_site', '');
                            clearVodTypes();
                            next();
                        }}
                    >
                        下一步
                    </Button>
                </>
            )
        },
        {
            title: '验证配置',
            content: isInitialized ? (
                <Form.Item label="选择默认资源" name="current_site" required rules={[{ required: true, message: '请选择默认站点' }]}>
                    <Select options={sites} />
                </Form.Item>
            ) : (
                <div>点击更新资源后选择</div>
            ),
            buttons: (
                <Flex gap={8}>
                    <Button onClick={() => prev()}>上一步</Button>
                    <Button
                        type="primary"
                        onClick={async () => {
                            try {
                                await getVodTypes({
                                    force: true
                                });
                            } catch (error) {
                                console.error(error);
                                message.error('验证接口失败');
                                form.setFieldValue('current_site', '');
                            }
                        }}
                    >
                        更新资源
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            updateSetting({ ...setting, current_site: form.getFieldValue('current_site') });
                            next();
                        }}
                    >
                        下一步
                    </Button>
                </Flex>
            )
        },
        {
            title: '保存配置',
            content: (
                <Descriptions
                    bordered
                    title="当前配置"
                    column={1}
                    labelStyle={{ width: 140 }}
                    contentStyle={{ minWidth: 200 }}
                    items={[
                        {
                            label: '网站名称',
                            children: form.getFieldValue('site_name')
                        },
                        {
                            label: 'VodHub API 地址',
                            children: form.getFieldValue('vod_hub_api')
                        },
                        {
                            label: '默认资源',
                            children: sites?.find((item) => item.value === form.getFieldValue('current_site'))?.label || ''
                        }
                    ]}
                />
            ),
            buttons: (
                <Flex gap={8}>
                    <Button onClick={() => prev()}>上一步</Button>

                    <Button type="primary" onClick={handleSubmit}>
                        保存配置
                    </Button>
                </Flex>
            )
        }
    ];

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    return (
        <Flex className={styles['vod-next-setting']} vertical>
            <Steps current={current} items={items} />
            <Form
                form={form}
                layout="vertical"
                className={styles['setting-form-content']}
                autoComplete="off"
                requiredMark={false}
                preserve
                initialValues={{
                    site_name: site_name || 'VodNext',
                    vod_hub_api: vod_hub_api || '/',
                    current_site: ''
                }}
                onValuesChange={(changedValues) => {
                    if ('current_site' in changedValues) {
                        if (changedValues.current_site) {
                            updateSetting({ ...setting, current_site: changedValues.current_site });
                        }
                    }
                }}
            >
                {steps[current].content}
            </Form>

            <div className={styles['setting-form-buttons']}>{steps[current].buttons}</div>

            <Divider className={styles['setting-divider']} />

            <ThemeSelector />
        </Flex>
    );
};

export default SettingPage;
