import { App, ConfigProvider, theme as antdTheme } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { useEffect } from 'react';

import { useThemeStore } from '@/store/useThemeStore';
import { getTheme, ThemeCssVariables, ThemeId } from '@/themes';

function applyCssVariables(variables: ThemeCssVariables) {
    const root = document.documentElement;
    Object.entries(variables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { themeId } = useThemeStore();
    const currentTheme = getTheme(themeId as ThemeId);

    const algorithm = currentTheme.isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;

    useEffect(() => {
        applyCssVariables(currentTheme.cssVariables);
    }, [currentTheme]);

    return (
        <ConfigProvider
            key={themeId}
            theme={{
                algorithm,
                ...currentTheme.config
            }}
            prefixCls="vod-next"
            locale={zhCN}
        >
            <App style={{ height: '100%', width: '100%' }}>{children}</App>
        </ConfigProvider>
    );
}
