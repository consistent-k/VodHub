import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, DownloadOutlined, UploadOutlined, LinkOutlined, ReloadOutlined, ClearOutlined } from '@ant-design/icons';
import type { CreateVideoSourceInput, ImportMode, ImportVideoSourceItem, VideoSource } from '@vodhub/shared/types/video-source';
import { Button, Table, Tag, Space, Modal, Form, Input, Switch, message, Popconfirm, Typography, Descriptions, Radio, Upload } from 'antd';
import type { Breakpoint } from 'antd';
import { useEffect, useState } from 'react';

import useSettingStore from '@/store/useSettingStore';
import useVideoSourcesStore from '@/store/useVideoSourcesStore';
import { useVodSitesStore } from '@/store/useVodSitesStore';

const { Text } = Typography;

const TEMPLATE_DATA: ImportVideoSourceItem[] = [
    {
        name: '示例资源',
        url: 'https://example.com',
        description: '示例描述',
        enabled: true
    }
];

const downloadJson = (data: unknown, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 4)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};

const CmsManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingCms, setEditingCms] = useState<VideoSource | null>(null);
    const [viewingCms, setViewingCms] = useState<VideoSource | null>(null);
    const [pendingImportItems, setPendingImportItems] = useState<ImportVideoSourceItem[] | null>(null);
    const [importMode, setImportMode] = useState<ImportMode>('overwrite');
    const [importUrl, setImportUrl] = useState('');
    const [isUrlImportMode, setIsUrlImportMode] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [form] = Form.useForm();

    const resetImportState = () => {
        setIsImportModalOpen(false);
        setPendingImportItems(null);
        setImportUrl('');
        setIsUrlImportMode(false);
        setIsImporting(false);
    };

    const { videoSources, isLoading, error, fetchVideoSources, addVideoSource, updateVideoSource, deleteVideoSource, toggleVideoSource, importVideoSources, clearVideoSources, clearError } =
        useVideoSourcesStore();
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

            if (current_site === `custom_${id}`) {
                updateSetting({
                    vod_hub_api: vod_hub_api || '',
                    site_name: site_name || '',
                    current_site: ''
                });
            }

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

    const handleToggle = async (id: string) => {
        try {
            await toggleVideoSource(id);

            const updated = useVideoSourcesStore.getState().videoSources.find((s) => s.id === id);
            if (updated && !updated.enabled && current_site === `custom_${id}`) {
                updateSetting({
                    vod_hub_api: vod_hub_api || '',
                    site_name: site_name || '',
                    current_site: ''
                });
            }

            await getVodTypes();
        } catch {
            // 错误已在store中处理
        }
    };

    const handleDownloadTemplate = () => {
        downloadJson(TEMPLATE_DATA, 'video-sources-template.json');
        message.success('模板已下载');
    };

    const handleExport = () => {
        if (videoSources.length === 0) {
            message.info('没有可导出的视频源');
            return;
        }
        const exportData = videoSources.map((s) => ({
            name: s.name,
            url: s.url,
            description: s.description,
            enabled: s.enabled
        }));
        downloadJson(exportData, 'video-sources-export.json');
        message.success('导出成功');
    };

    const handleClearAll = async () => {
        clearVideoSources();
        updateSetting({
            vod_hub_api: vod_hub_api || '',
            site_name: site_name || '',
            current_site: ''
        });
        await getVodTypes();
        message.success('已清空所有视频源');
    };

    const executeImport = (items: ImportVideoSourceItem[], mode: ImportMode) => {
        if (items.length === 0) {
            message.warning('导入数据为空');
            return;
        }
        const { imported } = importVideoSources(items, mode);
        message.success(`成功导入 ${imported} 条视频源`);
        resetImportState();
        getVodTypes().catch(() => {});
    };

    const handleFileImport = () => {
        setIsUrlImportMode(false);
        setImportMode('overwrite');
        setPendingImportItems(null);
        setIsImportModalOpen(true);
    };

    const handleFileUpload = async (file: File) => {
        try {
            const text = await file.text();
            const items = JSON.parse(text) as ImportVideoSourceItem[];
            if (!Array.isArray(items)) {
                message.error('JSON 格式错误，应为数组');
                return false;
            }
            setPendingImportItems(items);
            message.success(`已加载 ${items.length} 条视频源`);
        } catch {
            message.error('解析 JSON 文件失败');
        }
        return false;
    };

    const handleUrlImport = () => {
        setIsUrlImportMode(true);
        setImportMode('overwrite');
        setImportUrl('');
        setPendingImportItems(null);
        setIsImportModalOpen(true);
    };

    const handleImportModalOk = async () => {
        if (isUrlImportMode) {
            if (!importUrl.trim()) {
                message.warning('请输入 JSON 地址');
                return;
            }
            setIsImporting(true);
            try {
                const res = await fetch(importUrl.trim());
                const items = (await res.json()) as ImportVideoSourceItem[];
                if (!Array.isArray(items)) {
                    message.error('返回数据格式错误，应为数组');
                    return;
                }
                executeImport(items, importMode);
            } catch {
                message.error('获取或解析 JSON 失败');
            } finally {
                setIsImporting(false);
            }
        } else if (pendingImportItems) {
            executeImport(pendingImportItems, importMode);
        } else {
            message.warning('请先选择 JSON 文件');
        }
    };

    const handleImportModalCancel = () => {
        resetImportState();
    };

    const columns = [
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
            ellipsis: true,
            responsive: ['md'] as Breakpoint[],
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
            responsive: ['lg'] as Breakpoint[],
            render: (text?: string) => text || '-'
        },
        {
            title: '状态',
            dataIndex: 'enabled',
            key: 'enabled',
            render: (enabled: boolean, record: VideoSource) => <Switch checked={enabled} onChange={() => handleToggle(record.id)} checkedChildren="启用" unCheckedChildren="禁用" />
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            responsive: ['lg'] as Breakpoint[],
            render: (date: string) => new Date(date).toLocaleString()
        },
        {
            title: '操作',
            key: 'action',
            render: (_: unknown, record: VideoSource) => (
                <Space size="small">
                    <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)} />
                    <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm title="确定要删除这个视频源吗？" onConfirm={() => handleDelete(record.id)} okText="确定" cancelText="取消">
                        <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ width: 124 }}>
                    添加视频源
                </Button>
                <Button icon={<ReloadOutlined />} onClick={fetchVideoSources} loading={isLoading}>
                    刷新
                </Button>
                <Button icon={<DownloadOutlined />} onClick={handleDownloadTemplate} style={{ width: 124 }}>
                    下载模板
                </Button>
                <Button icon={<UploadOutlined />} onClick={handleExport} style={{ width: 124 }}>
                    导出
                </Button>
                <Button icon={<LinkOutlined />} onClick={handleUrlImport} style={{ width: 124 }}>
                    从 URL 导入
                </Button>
                <Button icon={<UploadOutlined />} onClick={handleFileImport} style={{ width: 124 }}>
                    导入文件
                </Button>
                <Popconfirm title="确定要清空所有视频源吗？" onConfirm={handleClearAll} okText="确定" cancelText="取消">
                    <Button danger icon={<ClearOutlined />} style={{ width: 124 }}>
                        清空全部
                    </Button>
                </Popconfirm>
            </div>

            <Table
                columns={columns}
                dataSource={videoSources}
                rowKey="id"
                loading={isLoading}
                pagination={{ pageSize: 10 }}
                scroll={{
                    x: 'fit-content'
                }}
            />

            {/* 添加/编辑模态框 */}
            <Modal
                title={editingCms ? '编辑视频源' : '添加视频源'}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                confirmLoading={isLoading}
                width={600}
                centered
                destroyOnHidden
            >
                <Form form={form} layout="vertical" initialValues={{ enabled: true }} autoComplete="off">
                    <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
                        <Input placeholder="例如: 我的视频源" />
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
                title="视频源详情"
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

            {/* 导入模式选择模态框 */}
            <Modal
                title={isUrlImportMode ? '从 URL 导入' : '导入视频源'}
                open={isImportModalOpen}
                onOk={handleImportModalOk}
                onCancel={handleImportModalCancel}
                confirmLoading={isImporting}
                width={500}
                centered
                destroyOnHidden
            >
                {isUrlImportMode ? (
                    <Form.Item label="JSON 地址" style={{ marginBottom: 16 }}>
                        <Input placeholder="https://example.com/video-sources.json" value={importUrl} onChange={(e) => setImportUrl(e.target.value)} />
                    </Form.Item>
                ) : (
                    <Form.Item label="选择 JSON 文件" style={{ marginBottom: 16 }}>
                        <Upload accept=".json" maxCount={1} beforeUpload={handleFileUpload}>
                            <Button icon={<UploadOutlined />}>选择文件</Button>
                        </Upload>
                        {pendingImportItems && <Text type="success">已加载 {pendingImportItems.length} 条视频源</Text>}
                    </Form.Item>
                )}
                <Form.Item label="导入模式">
                    <Radio.Group value={importMode} onChange={(e) => setImportMode(e.target.value)}>
                        <Space direction="vertical">
                            <Radio value="overwrite">
                                <Text strong>全覆盖</Text>
                                <br />
                                <Text type="secondary">清空现有视频源，仅保留导入的数据</Text>
                            </Radio>
                            <Radio value="merge">
                                <Text strong>合并</Text>
                                <br />
                                <Text type="secondary">将导入数据合并到现有列表，相同 URL 的源会被替换</Text>
                            </Radio>
                        </Space>
                    </Radio.Group>
                </Form.Item>
            </Modal>
        </>
    );
};

export default CmsManagement;
