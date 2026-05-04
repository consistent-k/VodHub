import { ThemeConfig } from 'antd';

export type ThemeId = 'vercel' | 'airbnb' | 'claude';

export interface ThemeCssVariables {
    '--color-primary': string;
    '--color-primary-light': string;
    '--color-bg': string;
    '--color-bg-container': string;
    '--color-bg-elevated': string;
    '--color-text': string;
    '--color-text-secondary': string;
    '--color-text-tertiary': string;
    '--color-border': string;
    '--color-border-secondary': string;
    '--color-bg-container-alpha': string;
    '--color-bg-elevated-alpha': string;
    '--color-bg-elevated-hover': string;
    '--color-primary-alpha-low': string;
    '--color-primary-alpha-medium': string;
    '--color-primary-alpha-hover': string;
    '--color-primary-shadow': string;
    '--color-overlay': string;
    '--color-overlay-border': string;
}

export interface ThemeDefinition {
    id: ThemeId;
    name: string;
    description: string;
    isDark: boolean;
    preview: {
        primary: string;
        background: string;
        accent: string;
    };
    cssVariables: ThemeCssVariables;
    config: ThemeConfig;
}

export const themes: Record<ThemeId, ThemeDefinition> = {
    vercel: {
        id: 'vercel',
        name: 'Vercel',
        description: 'Vercel设计风格',
        isDark: false,
        preview: {
            primary: '#171717',
            background: '#ffffff',
            accent: '#0072f5'
        },
        cssVariables: {
            '--color-primary': '#171717',
            '--color-primary-light': '#4d4d4d',
            '--color-bg': '#ffffff',
            '--color-bg-container': '#ffffff',
            '--color-bg-elevated': '#fafafa',
            '--color-text': '#171717',
            '--color-text-secondary': '#4d4d4d',
            '--color-text-tertiary': '#666666',
            '--color-border': 'rgba(0, 0, 0, 0.08)',
            '--color-border-secondary': 'rgba(0, 0, 0, 0.04)',
            '--color-bg-container-alpha': 'rgba(255, 255, 255, 0.85)',
            '--color-bg-elevated-alpha': 'rgba(250, 250, 250, 0.7)',
            '--color-bg-elevated-hover': 'rgba(235, 235, 235, 0.9)',
            '--color-primary-alpha-low': 'rgba(23, 23, 23, 0.1)',
            '--color-primary-alpha-medium': 'rgba(23, 23, 23, 0.3)',
            '--color-primary-alpha-hover': 'rgba(23, 23, 23, 0.12)',
            '--color-primary-shadow': 'rgba(23, 23, 23, 0.1)',
            '--color-overlay': 'rgba(0, 0, 0, 0.5)',
            '--color-overlay-border': 'rgba(255, 255, 255, 0.2)'
        },
        config: {
            algorithm: undefined,
            token: {
                colorPrimary: '#171717',
                colorBgContainer: '#ffffff',
                colorBgElevated: '#fafafa',
                colorBgLayout: '#ffffff',
                colorText: '#171717',
                colorTextSecondary: '#4d4d4d',
                colorTextTertiary: '#666666',
                colorBorder: 'rgba(0, 0, 0, 0.08)',
                colorBorderSecondary: 'rgba(0, 0, 0, 0.04)',
                borderRadius: 6,
                fontFamily: '"Geist", "Inter", "Roboto", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'
            },
            components: {
                Button: {
                    colorPrimary: '#171717',
                    borderRadius: 6,
                    fontWeight: 500,
                    primaryColor: '#ffffff'
                },
                Card: {
                    borderRadiusLG: 8
                },
                Input: {
                    hoverBorderColor: '#171717',
                    activeBorderColor: '#171717',
                    colorBgContainer: '#ffffff',
                    colorBorder: 'rgba(0, 0, 0, 0.08)',
                    colorText: '#171717',
                    colorTextPlaceholder: '#666666',
                    activeShadow: '0 0 0 1px rgba(23, 23, 23, 0.2)'
                },
                Layout: {
                    bodyBg: '#ffffff',
                    headerBg: '#ffffff',
                    footerBg: '#ffffff',
                    siderBg: '#ffffff'
                },
                Collapse: {
                    headerPadding: 0,
                    contentPadding: 0
                },
                Tag: {
                    colorBgContainer: '#ebf5ff',
                    colorText: '#0068d6'
                },
                Select: {
                    colorBgContainer: '#ffffff',
                    colorBorder: 'rgba(0, 0, 0, 0.08)',
                    colorText: '#171717',
                    colorTextPlaceholder: '#666666',
                    optionSelectedBg: 'rgba(23, 23, 23, 0.1)',
                    optionSelectedColor: '#171717',
                    optionActiveBg: 'rgba(235, 235, 235, 0.8)',
                    selectorBg: '#ffffff'
                },
                Tabs: {
                    itemColor: '#666666',
                    itemSelectedColor: '#171717',
                    itemHoverColor: '#171717',
                    inkBarColor: '#171717',
                    itemActiveColor: '#171717'
                },
                Steps: {
                    colorPrimary: '#171717',
                    colorText: '#171717',
                    colorTextDescription: '#666666',
                    colorIcon: '#666666',
                    colorPrimaryBorder: '#171717'
                },
                Descriptions: {
                    colorText: '#171717',
                    colorTextSecondary: '#4d4d4d',
                    colorTextTertiary: '#666666',
                    labelColor: '#666666',
                    contentColor: '#4d4d4d'
                },
                Typography: {
                    colorText: '#4d4d4d',
                    colorTextSecondary: '#666666'
                },
                Form: {
                    labelColor: '#4d4d4d',
                    labelRequiredMarkColor: '#171717'
                }
            }
        }
    },
    airbnb: {
        id: 'airbnb',
        name: 'Airbnb',
        description: 'Airbnb设计风格，纯白背景，Rausch红强调色',
        isDark: false,
        preview: {
            primary: '#ff385c',
            background: '#ffffff',
            accent: '#f2f2f2'
        },
        cssVariables: {
            '--color-primary': '#ff385c',
            '--color-primary-light': '#ff6b8b',
            '--color-bg': '#ffffff',
            '--color-bg-container': '#ffffff',
            '--color-bg-elevated': '#f2f2f2',
            '--color-text': '#222222',
            '--color-text-secondary': '#6a6a6a',
            '--color-text-tertiary': '#929292',
            '--color-border': '#c1c1c1',
            '--color-border-secondary': '#e8e8e8',
            '--color-bg-container-alpha': 'rgba(255, 255, 255, 0.85)',
            '--color-bg-elevated-alpha': 'rgba(242, 242, 242, 0.7)',
            '--color-bg-elevated-hover': 'rgba(232, 232, 232, 0.9)',
            '--color-primary-alpha-low': 'rgba(255, 56, 92, 0.1)',
            '--color-primary-alpha-medium': 'rgba(255, 56, 92, 0.3)',
            '--color-primary-alpha-hover': 'rgba(255, 56, 92, 0.12)',
            '--color-primary-shadow': 'rgba(255, 56, 92, 0.4)',
            '--color-overlay': 'rgba(0, 0, 0, 0.5)',
            '--color-overlay-border': 'rgba(255, 255, 255, 0.2)'
        },
        config: {
            algorithm: undefined,
            token: {
                colorPrimary: '#ff385c',
                colorBgContainer: '#ffffff',
                colorBgElevated: '#f2f2f2',
                colorBgLayout: '#ffffff',
                colorText: '#222222',
                colorTextSecondary: '#6a6a6a',
                colorTextTertiary: '#929292',
                colorBorder: '#c1c1c1',
                colorBorderSecondary: '#e8e8e8',
                borderRadius: 12,
                fontFamily: '"Geist", "Inter", "Roboto", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'
            },
            components: {
                Button: {
                    colorPrimary: '#ff385c',
                    borderRadius: 8,
                    fontWeight: 600,
                    primaryColor: '#ffffff'
                },
                Card: {
                    borderRadiusLG: 20,
                    boxShadow: 'rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px'
                },
                Input: {
                    hoverBorderColor: '#ff385c',
                    activeBorderColor: '#ff385c',
                    colorBgContainer: '#ffffff',
                    colorBorder: '#c1c1c1',
                    colorText: '#222222',
                    colorTextPlaceholder: '#929292',
                    activeShadow: '0 0 0 2px rgba(255, 56, 92, 0.2)'
                },
                Layout: {
                    bodyBg: '#ffffff',
                    headerBg: '#ffffff',
                    footerBg: '#ffffff',
                    siderBg: '#ffffff'
                },
                Collapse: {
                    headerPadding: 0,
                    contentPadding: 0
                },
                Tag: {
                    colorBgContainer: '#f2f2f2',
                    colorText: '#6a6a6a'
                },
                Select: {
                    colorBgContainer: '#ffffff',
                    colorBorder: '#c1c1c1',
                    colorText: '#222222',
                    colorTextPlaceholder: '#929292',
                    optionSelectedBg: 'rgba(255, 56, 92, 0.1)',
                    optionSelectedColor: '#ff385c',
                    optionActiveBg: 'rgba(242, 242, 242, 0.8)',
                    selectorBg: '#ffffff'
                },
                Tabs: {
                    itemColor: '#929292',
                    itemSelectedColor: '#ff385c',
                    itemHoverColor: '#222222',
                    inkBarColor: '#ff385c',
                    itemActiveColor: '#ff385c'
                },
                Steps: {
                    colorPrimary: '#ff385c',
                    colorText: '#222222',
                    colorTextDescription: '#929292',
                    colorIcon: '#929292',
                    colorPrimaryBorder: '#ff385c'
                },
                Descriptions: {
                    colorText: '#222222',
                    colorTextSecondary: '#6a6a6a',
                    colorTextTertiary: '#929292',
                    labelColor: '#929292',
                    contentColor: '#6a6a6a'
                },
                Typography: {
                    colorText: '#6a6a6a',
                    colorTextSecondary: '#929292'
                },
                Form: {
                    labelColor: '#6a6a6a',
                    labelRequiredMarkColor: '#ff385c'
                }
            }
        }
    },
    claude: {
        id: 'claude',
        name: 'Claude',
        description: 'Claude设计风格，温暖中性色系，陶红色强调色',
        isDark: false,
        preview: {
            primary: '#c96442',
            background: '#f5f4ed',
            accent: '#e8e6dc'
        },
        cssVariables: {
            '--color-primary': '#c96442',
            '--color-primary-light': '#d97757',
            '--color-bg': '#f5f4ed',
            '--color-bg-container': '#faf9f5',
            '--color-bg-elevated': '#e8e6dc',
            '--color-text': '#141413',
            '--color-text-secondary': '#5e5d59',
            '--color-text-tertiary': '#87867f',
            '--color-border': '#f0eee6',
            '--color-border-secondary': '#e8e6dc',
            '--color-bg-container-alpha': 'rgba(250, 249, 245, 0.85)',
            '--color-bg-elevated-alpha': 'rgba(232, 230, 220, 0.7)',
            '--color-bg-elevated-hover': 'rgba(232, 230, 220, 0.9)',
            '--color-primary-alpha-low': 'rgba(201, 100, 66, 0.1)',
            '--color-primary-alpha-medium': 'rgba(201, 100, 66, 0.3)',
            '--color-primary-alpha-hover': 'rgba(201, 100, 66, 0.12)',
            '--color-primary-shadow': 'rgba(201, 100, 66, 0.4)',
            '--color-overlay': 'rgba(0, 0, 0, 0.5)',
            '--color-overlay-border': 'rgba(255, 255, 255, 0.2)'
        },
        config: {
            algorithm: undefined,
            token: {
                colorPrimary: '#c96442',
                colorBgContainer: '#faf9f5',
                colorBgElevated: '#e8e6dc',
                colorBgLayout: '#f5f4ed',
                colorText: '#141413',
                colorTextSecondary: '#5e5d59',
                colorTextTertiary: '#87867f',
                colorBorder: '#f0eee6',
                colorBorderSecondary: '#e8e6dc',
                borderRadius: 12,
                fontFamily: '"Geist", "Inter", "Roboto", "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'
            },
            components: {
                Button: {
                    colorPrimary: '#c96442',
                    borderRadius: 8,
                    fontWeight: 600,
                    primaryColor: '#ffffff'
                },
                Card: {
                    borderRadiusLG: 16,
                    boxShadow: 'rgba(0,0,0,0.05) 0px 4px 24px'
                },
                Input: {
                    hoverBorderColor: '#c96442',
                    activeBorderColor: '#c96442',
                    colorBgContainer: '#faf9f5',
                    colorBorder: '#f0eee6',
                    colorText: '#141413',
                    colorTextPlaceholder: '#87867f',
                    activeShadow: '0 0 0 2px rgba(201, 100, 66, 0.2)'
                },
                Layout: {
                    bodyBg: '#f5f4ed',
                    headerBg: '#faf9f5',
                    footerBg: '#f5f4ed',
                    siderBg: '#faf9f5'
                },
                Collapse: {
                    headerPadding: 0,
                    contentPadding: 0
                },
                Tag: {
                    colorBgContainer: '#e8e6dc',
                    colorText: '#5e5d59'
                },
                Select: {
                    colorBgContainer: '#faf9f5',
                    colorBorder: '#f0eee6',
                    colorText: '#141413',
                    colorTextPlaceholder: '#87867f',
                    optionSelectedBg: 'rgba(201, 100, 66, 0.1)',
                    optionSelectedColor: '#c96442',
                    optionActiveBg: 'rgba(232, 230, 220, 0.8)',
                    selectorBg: '#faf9f5'
                },
                Tabs: {
                    itemColor: '#87867f',
                    itemSelectedColor: '#c96442',
                    itemHoverColor: '#141413',
                    inkBarColor: '#c96442',
                    itemActiveColor: '#c96442'
                },
                Steps: {
                    colorPrimary: '#c96442',
                    colorText: '#141413',
                    colorTextDescription: '#87867f',
                    colorIcon: '#87867f',
                    colorPrimaryBorder: '#c96442'
                },
                Descriptions: {
                    colorText: '#141413',
                    colorTextSecondary: '#5e5d59',
                    colorTextTertiary: '#87867f',
                    labelColor: '#87867f',
                    contentColor: '#5e5d59'
                },
                Typography: {
                    colorText: '#5e5d59',
                    colorTextSecondary: '#87867f'
                },
                Form: {
                    labelColor: '#5e5d59',
                    labelRequiredMarkColor: '#c96442'
                }
            }
        }
    }
};

export const getTheme = (themeId: ThemeId): ThemeDefinition => {
    return themes[themeId] || themes.vercel;
};

export const themeList: ThemeDefinition[] = Object.values(themes);
