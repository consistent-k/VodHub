import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import type { VideoSource, CreateVideoSourceInput } from '@vodhub/shared/types/video-source';
import { Button, Table, Tag, Space, Modal, Form, Input, Switch, message, Popconfirm, Typography, Descriptions } from 'antd';
import { useEffect, useState } from 'react';

import useSettingStore from '@/lib/store/useSettingStore';
import useVideoSourcesStore from '@/lib/store/useVideoSourcesStore';
import { useVodSitesStore } from '@/lib/store/useVodSitesStore';

const { Text } = Typography;

const CmsManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingCms, setEditingCms] = useState<VideoSource | null>(null);
    const [viewingCms, setViewingCms] = useState<VideoSource | null>(null);
    const [form] = Form.useForm();

    const { videoSources, isLoading, error, fetchVideoSources, addVideoSource, updateVideoSource, deleteVideoSource, toggleVideoSource, clearError } = useVideoSourcesStore();
    const { vod_hub_api, site_name, current_site, updateSetting } = useSettingStore();
    const { getVodTypes } = useVodSitesStore();

    useEffect(() => {
        fetchVideoSources();
    }, []);

    useEffect(() => {
        if (error) {
            message.error(error);
            clearError();
        }
    }, [error]);

    // 合并内置CMS和自定义CMS列表
    const mergedCmsList = videoSources.map((source) => ({ ...source, isBuiltin: source.type === 'builtin' }));
    const mergedLoading = isLoading;

    const handleAdd = () => {
        setEditingCms(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (cms: VideoSource) => {
        setEditingCms(cms);
        form.setFieldsValue({
            name: cms.name,
            url: cms.url,
            description: cms.description,
            enabled: cms.enabled
        });
        setIsModalOpen(true);
    };

    const handleView = (cms: VideoSource) => {
        setViewingCms(cms);
        setIsViewModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteVideoSource(id);
            message.success('删除成功');

            // 如果当前选中的站点是被删除的CMS，则清除选中
            if (current_site === `custom_${id}`) {
                updateSetting({
                    vod_hub_api: vod_hub_api || '',
                    site_name: site_name || '',
                    current_site: ''
                });
            }

            // 刷新站点列表
            await getVodTypes();
        } catch {
            // 错误已在store中处理
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const input: CreateVideoSourceInput = {
                name: values.name,
                url: values.url,
                description: values.description,
                enabled: values.enabled ?? true
            };

            if (editingCms) {
                await updateVideoSource({ ...input, id: editingCms.id });
                message.success('更新成功');

                // 如果当前选中的站点是被禁用的CMS，则清除选中
                if (!input.enabled && current_site === `custom_${editingCms.id}`) {
                    updateSetting({
                        vod_hub_api: vod_hub_api || '',
                        site_name: site_name || '',
                        current_site: ''
                    });
                }
            } else {
                await addVideoSource(input);
                message.success('添加成功');
            }

            // 刷新站点列表
            await getVodTypes();

            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error('表单验证失败:', error);
        }
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleViewModalCancel = () => {
        setIsViewModalOpen(false);
        setViewingCms(null);
    };

    const handleToggleBuiltin = async (id: string) => {
        try {
            await toggleVideoSource(id);

            // 如果当前选中的站点是被禁用的内置源，则清除选中
            const toggledSource = videoSources.find((s) => s.id === id);
            if (toggledSource && !toggledSource.enabled && current_site === id) {
                updateSetting({
                    vod_hub_api: vod_hub_api || '',
                    site_name: site_name || '',
                    current_site: ''
                });
            }

            // 刷新站点列表
            await getVodTypes();
        } catch (error) {
            // 错误已在store中处理
        }
    };

    const columns = [
        {
            title: '类型',
            key: 'type',
            render: (_: any, record: VideoSource) => (record.type === 'builtin' ? <Tag color="blue">内置</Tag> : <Tag color="green">自定义</Tag>)
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: VideoSource) => (
                <Space>
                    <Text strong>{text}</Text>
                    {!record.enabled && <Tag color="default">已禁用</Tag>}
                </Space>
            )
        },
        {
            title: '地址',
            dataIndex: 'url',
            key: 'url',
            render: (text: string) => (
                <Text type="secondary" copyable>
                    {text}
                </Text>
            )
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            render: (text?: string) => text || '-'
        },
        {
            title: '状态',
            dataIndex: 'enabled',
            key: 'enabled',
            render: (enabled: boolean, record: VideoSource) =>
                record.type === 'builtin' ? (
                    <Switch checked={enabled} onChange={() => handleToggleBuiltin(record.id)} checkedChildren="启用" unCheckedChildren="禁用" />
                ) : (
                    <Tag color={enabled ? 'success' : 'default'}>{enabled ? '启用' : '禁用'}</Tag>
                )
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleString()
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: VideoSource) => (
                <Space size="small">
                    <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)} />
                    {record.type === 'builtin' ? (
                        // 内置视频源只能查看，不能编辑/删除
                        <Button type="text" size="small" icon={<EditOutlined />} disabled title="内置视频源不可编辑" />
                    ) : (
                        <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    )}
                    {record.type === 'builtin' ? (
                        // 内置视频源不能删除
                        <Button type="text" size="small" icon={<DeleteOutlined />} disabled title="内置视频源不可删除" />
                    ) : (
                        <Popconfirm title="确定要删除这个CMS地址吗？" onConfirm={() => handleDelete(record.id)} okText="确定" cancelText="取消">
                            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    )}
                </Space>
            )
        }
    ];

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        添加CMS地址
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={fetchVideoSources} loading={mergedLoading}>
                        刷新
                    </Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={mergedCmsList}
                rowKey={(record) => (record.isBuiltin ? `builtin_${record.id}` : `custom_${record.id}`)}
                loading={mergedLoading}
                pagination={{ pageSize: 10 }}
                scroll={{
                    x: 'fit-content'
                }}
            />

            {/* 添加/编辑模态框 */}
            <Modal title={editingCms ? '编辑CMS地址' : '添加CMS地址'} open={isModalOpen} onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={isLoading} width={600}>
                <Form form={form} layout="vertical" initialValues={{ enabled: true }}>
                    <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
                        <Input placeholder="例如: 我的CMS资源" />
                    </Form.Item>

                    <Form.Item
                        name="url"
                        label="地址"
                        rules={[
                            { required: true, message: '请输入地址' },
                            { type: 'url', message: '请输入有效的URL' }
                        ]}
                    >
                        <Input placeholder="例如: https://api.example.com" />
                    </Form.Item>

                    <Form.Item name="description" label="描述">
                        <Input.TextArea placeholder="可选描述" rows={3} />
                    </Form.Item>

                    <Form.Item name="enabled" label="状态" valuePropName="checked">
                        <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 查看模态框 */}
            <Modal
                title="CMS地址详情"
                open={isViewModalOpen}
                onCancel={handleViewModalCancel}
                footer={[
                    <Button key="close" onClick={handleViewModalCancel}>
                        关闭
                    </Button>
                ]}
                width={600}
            >
                {viewingCms && (
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="类型">{viewingCms.type === 'builtin' ? <Tag color="blue">内置视频源</Tag> : <Tag color="green">自定义CMS</Tag>}</Descriptions.Item>
                        <Descriptions.Item label="ID">
                            <Text copyable>{viewingCms.id}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="名称">{viewingCms.name}</Descriptions.Item>
                        <Descriptions.Item label="地址">
                            <Text copyable>{viewingCms.url}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="描述">{viewingCms.description || '-'}</Descriptions.Item>
                        <Descriptions.Item label="状态">
                            <Tag color={viewingCms.enabled ? 'success' : 'default'}>{viewingCms.enabled ? '启用' : '禁用'}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="创建时间">{new Date(viewingCms.createdAt).toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="更新时间">{new Date(viewingCms.updatedAt).toLocaleString()}</Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </>
    );
};

export default CmsManagement;