import { CloseOutlined, LoadingOutlined, RobotOutlined, SendOutlined } from '@ant-design/icons';
import { App, Button, Card, FloatButton, Tooltip, Typography } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useStyles } from './styles';

interface AiSummaryProps {
    title: string;
    content: string;
    year?: string;
    area?: string;
    actor?: string;
    director?: string;
}

const PANEL_WIDTH = 360;

const AiSummary: React.FC<AiSummaryProps> = ({ title, content, year, area, actor, director }) => {
    const { styles } = useStyles();
    const { message } = App.useApp();
    const [expanded, setExpanded] = useState(false);
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const abortRef = useRef<AbortController | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, offsetX: 0, offsetY: 0 });

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [initialized, setInitialized] = useState(false);

    // 初始化面板位置到右下角
    useEffect(() => {
        if (expanded && !initialized) {
            setPosition({
                x: window.innerWidth - PANEL_WIDTH - 24,
                y: window.innerHeight - 480 - 24
            });
            setInitialized(true);
        }
    }, [expanded, initialized]);

    // 拖动处理
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        // 忽略按钮点击
        if ((e.target as HTMLElement).closest('button')) return;
        e.preventDefault();
        const panel = panelRef.current;
        if (!panel) return;
        const rect = panel.getBoundingClientRect();
        dragRef.current = {
            isDragging: true,
            startX: e.clientX,
            startY: e.clientY,
            offsetX: e.clientX - rect.left,
            offsetY: e.clientY - rect.top
        };

        const handleMouseMove = (ev: MouseEvent) => {
            if (!dragRef.current.isDragging) return;
            const newX = Math.max(0, Math.min(ev.clientX - dragRef.current.offsetX, window.innerWidth - PANEL_WIDTH));
            const newY = Math.max(0, Math.min(ev.clientY - dragRef.current.offsetY, window.innerHeight - 60));
            setPosition({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            dragRef.current.isDragging = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, []);

    const handleSummarize = useCallback(async () => {
        if (loading) return;

        setSummary('');
        setError('');
        setLoading(true);

        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const response = await fetch('/api/vodhub/ai/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, year, area, actor, director }),
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error(`请求失败: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('无法读取响应流');
            }

            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const data = line.slice(5).trim();
                        if (data === '[DONE]') continue;
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.error) {
                                setError(parsed.error);
                                break;
                            }
                            setSummary((prev) => prev + String(parsed));
                        } catch {
                            // skip non-JSON lines
                        }
                    }
                }
            }
        } catch (err: unknown) {
            if (err instanceof Error && err.name === 'AbortError') return;
            const msg = err instanceof Error ? err.message : 'AI 总结失败';
            setError(msg);
            message.error(msg);
        } finally {
            setLoading(false);
            abortRef.current = null;
        }
    }, [title, content, year, area, actor, director, loading, message]);

    const handleStop = useCallback(() => {
        abortRef.current?.abort();
        setLoading(false);
    }, []);

    const handleClose = useCallback(() => {
        handleStop();
        setExpanded(false);
        setSummary('');
        setError('');
        setInitialized(false);
    }, [handleStop]);

    const handleToggle = useCallback(() => {
        setExpanded((prev) => !prev);
    }, []);

    // 自动触发总结
    useEffect(() => {
        if (expanded && !summary && !loading && !error) {
            handleSummarize();
        }
    }, [expanded]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {/* 展开状态：可拖动悬浮面板 */}
            {expanded && (
                <div ref={panelRef} className={styles.panel} style={{ left: position.x, top: position.y }}>
                    <Card
                        title={null}
                        styles={{
                            body: { padding: 0, display: 'flex', flexDirection: 'column', maxHeight: 480 }
                        }}
                    >
                        <div className={styles.panelHeader} onMouseDown={handleMouseDown}>
                            <span className={styles.panelTitle}>✨ AI 总结</span>
                            <div className={styles.panelActions}>
                                {loading && (
                                    <Tooltip title="停止生成">
                                        <Button type="text" size="small" danger icon={<LoadingOutlined />} onClick={handleStop} />
                                    </Tooltip>
                                )}
                                <Tooltip title="关闭">
                                    <Button type="text" size="small" icon={<CloseOutlined />} onClick={handleClose} />
                                </Tooltip>
                            </div>
                        </div>
                        <div className={styles.panelContent}>
                            {!summary && !loading && !error && (
                                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                                    <Button type="primary" icon={<SendOutlined />} onClick={handleSummarize} loading={loading}>
                                        生成 AI 总结
                                    </Button>
                                </div>
                            )}
                            {(summary || loading) && (
                                <Typography.Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
                                    {summary}
                                    {loading && <span className={styles.cursor} />}
                                </Typography.Paragraph>
                            )}
                            {error && <div className={styles.error}>{error}</div>}
                        </div>
                    </Card>
                </div>
            )}

            {/* 收起状态：浮动触发按钮 */}
            {!expanded && (
                <Tooltip title="AI 总结" placement="left">
                    <FloatButton icon={<RobotOutlined />} type="primary" onClick={handleToggle} style={{ right: 24, bottom: 24, width: 48, height: 48 }} />
                </Tooltip>
            )}
        </>
    );
};

export default AiSummary;
