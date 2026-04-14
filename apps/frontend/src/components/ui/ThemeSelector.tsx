import { CheckOutlined } from '@ant-design/icons';
import { Card, Flex, Typography } from 'antd';

import styles from './ThemeSelector.module.scss';

import { useThemeStore } from '@/lib/store/useThemeStore';
import { themeList, ThemeId } from '@/lib/themes';

const { Text } = Typography;

export function ThemeSelector() {
    const { themeId, setThemeId } = useThemeStore();

    return (
        <Flex vertical gap={16}>
            <Text strong style={{ fontSize: 16 }}>
                主题风格
            </Text>
            <Flex gap={16} wrap="wrap">
                {themeList.map((theme) => {
                    const isSelected = themeId === theme.id;

                    return (
                        <Card
                            key={theme.id}
                            hoverable
                            onClick={() => setThemeId(theme.id as ThemeId)}
                            className={`${styles['theme-card']} ${isSelected ? styles['theme-card-selected'] : ''}`}
                            style={{
                                width: 200,
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            styles={{
                                body: {
                                    padding: 16
                                }
                            }}
                        >
                            {isSelected && (
                                <div className={styles['theme-check']}>
                                    <CheckOutlined />
                                </div>
                            )}

                            <Flex vertical gap={12}>
                                <div
                                    className={styles['theme-preview']}
                                    style={{
                                        backgroundColor: theme.preview.background,
                                        borderRadius: 8,
                                        padding: 12,
                                        height: 80,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        <div
                                            style={{
                                                width: 40,
                                                height: 8,
                                                backgroundColor: theme.preview.primary,
                                                borderRadius: 4
                                            }}
                                        />
                                        <div
                                            style={{
                                                width: 24,
                                                height: 8,
                                                backgroundColor: theme.preview.accent,
                                                borderRadius: 4
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        <div
                                            style={{
                                                flex: 1,
                                                height: 24,
                                                backgroundColor: theme.preview.accent,
                                                borderRadius: 4,
                                                opacity: 0.6
                                            }}
                                        />
                                        <div
                                            style={{
                                                flex: 1,
                                                height: 24,
                                                backgroundColor: theme.preview.accent,
                                                borderRadius: 4,
                                                opacity: 0.4
                                            }}
                                        />
                                    </div>
                                </div>

                                <Flex vertical gap={4}>
                                    <Text strong style={{ fontSize: 14 }}>
                                        {theme.name}
                                    </Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {theme.description}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Card>
                    );
                })}
            </Flex>
        </Flex>
    );
}
