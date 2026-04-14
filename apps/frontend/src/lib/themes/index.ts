import { ThemeConfig } from 'antd';

export type ThemeId = 'midnight' | 'aurora' | 'cyber';

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
    midnight: {
        id: 'midnight',
        name: '午夜玫瑰',
        description: '深邃暗夜，优雅玫瑰红',
        isDark: true,
        preview: {
            primary: '#E11D48',
            background: '#0F0F23',
            accent: '#1E1B4B'
        },
        cssVariables: {
            '--color-primary': '#E11D48',
            '--color-primary-light': '#FB7185',
            '--color-bg': '#000000',
            '--color-bg-container': '#0F0F23',
            '--color-bg-elevated': '#1E1B4B',
            '--color-text': '#F8FAFC',
            '--color-text-secondary': '#94A3B8',
            '--color-text-tertiary': '#64748B',
            '--color-border': '#334155',
            '--color-border-secondary': 'rgba(51, 65, 85, 0.5)',
            '--color-bg-container-alpha': 'rgba(15, 15, 35, 0.6)',
            '--color-bg-elevated-alpha': 'rgba(30, 27, 75, 0.5)',
            '--color-bg-elevated-hover': 'rgba(30, 27, 75, 0.8)',
            '--color-primary-alpha-low': 'rgba(225, 29, 72, 0.1)',
            '--color-primary-alpha-medium': 'rgba(225, 29, 72, 0.3)',
            '--color-primary-alpha-hover': 'rgba(225, 29, 72, 0.12)',
            '--color-primary-shadow': 'rgba(225, 29, 72, 0.4)',
            '--color-overlay': 'rgba(0, 0, 0, 0.7)',
            '--color-overlay-border': 'rgba(255, 255, 255, 0.1)'
        },
        config: {
            algorithm: undefined,
            token: {
                colorPrimary: '#E11D48',
                colorBgContainer: '#0F0F23',
                colorBgElevated: '#1E1B4B',
                colorBgLayout: '#000000',
                colorText: '#F8FAFC',
                colorTextSecondary: '#94A3B8',
                colorTextTertiary: '#64748B',
                colorBorder: '#334155',
                colorBorderSecondary: 'rgba(51, 65, 85, 0.5)',
                borderRadius: 12,
                fontFamily: '"Righteous", "Poppins", Inter, Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'
            },
            components: {
                Button: {
                    colorPrimary: '#E11D48',
                    borderRadius: 8,
                    fontWeight: 600,
                    primaryColor: '#F8FAFC'
                },
                Card: {
                    borderRadiusLG: 16
                },
                Input: {
                    hoverBorderColor: '#E11D48',
                    activeBorderColor: '#E11D48',
                    colorBgContainer: '#0F0F23',
                    colorBorder: '#334155',
                    colorText: '#F8FAFC',
                    colorTextPlaceholder: '#64748B',
                    activeShadow: '0 0 0 2px rgba(225, 29, 72, 0.2)'
                },
                Layout: {
                    bodyBg: '#000000',
                    headerBg: '#0F0F23',
                    footerBg: '#000000',
                    siderBg: '#0F0F23'
                },
                Collapse: {
                    headerPadding: 0,
                    contentPadding: 0
                },
                Tag: {
                    colorBgContainer: '#1E1B4B',
                    colorText: '#94A3B8'
                },
                Select: {
                    colorBgContainer: '#0F0F23',
                    colorBorder: '#334155',
                    colorText: '#F8FAFC',
                    colorTextPlaceholder: '#64748B',
                    optionSelectedBg: 'rgba(225, 29, 72, 0.1)',
                    optionSelectedColor: '#E11D48',
                    optionActiveBg: 'rgba(30, 27, 75, 0.8)',
                    selectorBg: '#0F0F23'
                },
                Tabs: {
                    itemColor: '#64748B',
                    itemSelectedColor: '#E11D48',
                    itemHoverColor: '#F8FAFC',
                    inkBarColor: '#E11D48',
                    itemActiveColor: '#E11D48'
                },
                Steps: {
                    colorPrimary: '#E11D48',
                    colorText: '#F8FAFC',
                    colorTextDescription: '#64748B',
                    colorIcon: '#64748B',
                    colorPrimaryBorder: '#E11D48'
                },
                Descriptions: {
                    colorText: '#F8FAFC',
                    colorTextSecondary: '#94A3B8',
                    colorTextTertiary: '#64748B',
                    labelColor: '#64748B',
                    contentColor: '#94A3B8'
                },
                Typography: {
                    colorText: '#94A3B8',
                    colorTextSecondary: '#64748B'
                },
                Form: {
                    labelColor: '#94A3B8',
                    labelRequiredMarkColor: '#E11D48'
                }
            }
        }
    },
    aurora: {
        id: 'aurora',
        name: '极光清新',
        description: '清新明亮，极光配色',
        isDark: false,
        preview: {
            primary: '#0891B2',
            background: '#F0FDFA',
            accent: '#CCFBF1'
        },
        cssVariables: {
            '--color-primary': '#0891B2',
            '--color-primary-light': '#22D3EE',
            '--color-bg': '#F8FAFC',
            '--color-bg-container': '#FFFFFF',
            '--color-bg-elevated': '#F0FDFA',
            '--color-text': '#0F172A',
            '--color-text-secondary': '#475569',
            '--color-text-tertiary': '#64748B',
            '--color-border': '#E2E8F0',
            '--color-border-secondary': '#F1F5F9',
            '--color-bg-container-alpha': 'rgba(255, 255, 255, 0.85)',
            '--color-bg-elevated-alpha': 'rgba(240, 253, 250, 0.7)',
            '--color-bg-elevated-hover': 'rgba(204, 251, 241, 0.9)',
            '--color-primary-alpha-low': 'rgba(8, 145, 178, 0.1)',
            '--color-primary-alpha-medium': 'rgba(8, 145, 178, 0.3)',
            '--color-primary-alpha-hover': 'rgba(8, 145, 178, 0.12)',
            '--color-primary-shadow': 'rgba(8, 145, 178, 0.3)',
            '--color-overlay': 'rgba(0, 0, 0, 0.5)',
            '--color-overlay-border': 'rgba(255, 255, 255, 0.2)'
        },
        config: {
            algorithm: undefined,
            token: {
                colorPrimary: '#0891B2',
                colorBgContainer: '#FFFFFF',
                colorBgElevated: '#F0FDFA',
                colorBgLayout: '#F8FAFC',
                colorText: '#0F172A',
                colorTextSecondary: '#475569',
                colorTextTertiary: '#64748B',
                colorBorder: '#E2E8F0',
                colorBorderSecondary: '#F1F5F9',
                borderRadius: 12,
                fontFamily: '"Righteous", "Poppins", Inter, Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'
            },
            components: {
                Button: {
                    colorPrimary: '#0891B2',
                    borderRadius: 8,
                    fontWeight: 600,
                    primaryColor: '#FFFFFF'
                },
                Card: {
                    borderRadiusLG: 16
                },
                Input: {
                    hoverBorderColor: '#0891B2',
                    activeBorderColor: '#0891B2',
                    colorBgContainer: '#FFFFFF',
                    colorBorder: '#E2E8F0',
                    colorText: '#0F172A',
                    colorTextPlaceholder: '#94A3B8',
                    activeShadow: '0 0 0 2px rgba(8, 145, 178, 0.2)'
                },
                Layout: {
                    bodyBg: '#F8FAFC',
                    headerBg: '#FFFFFF',
                    footerBg: '#F8FAFC',
                    siderBg: '#FFFFFF'
                },
                Collapse: {
                    headerPadding: 0,
                    contentPadding: 0
                },
                Tag: {
                    colorBgContainer: '#CCFBF1',
                    colorText: '#0F766E'
                },
                Select: {
                    colorBgContainer: '#FFFFFF',
                    colorBorder: '#E2E8F0',
                    colorText: '#0F172A',
                    colorTextPlaceholder: '#94A3B8',
                    optionSelectedBg: 'rgba(8, 145, 178, 0.1)',
                    optionSelectedColor: '#0891B2',
                    optionActiveBg: 'rgba(204, 251, 241, 0.8)',
                    selectorBg: '#FFFFFF'
                },
                Tabs: {
                    itemColor: '#64748B',
                    itemSelectedColor: '#0891B2',
                    itemHoverColor: '#0F172A',
                    inkBarColor: '#0891B2',
                    itemActiveColor: '#0891B2'
                },
                Steps: {
                    colorPrimary: '#0891B2',
                    colorText: '#0F172A',
                    colorTextDescription: '#64748B',
                    colorIcon: '#64748B',
                    colorPrimaryBorder: '#0891B2'
                },
                Descriptions: {
                    colorText: '#0F172A',
                    colorTextSecondary: '#475569',
                    colorTextTertiary: '#64748B',
                    labelColor: '#64748B',
                    contentColor: '#475569'
                },
                Typography: {
                    colorText: '#475569',
                    colorTextSecondary: '#64748B'
                },
                Form: {
                    labelColor: '#475569',
                    labelRequiredMarkColor: '#0891B2'
                }
            }
        }
    },
    cyber: {
        id: 'cyber',
        name: '赛博霓虹',
        description: '未来科技，霓虹紫光',
        isDark: true,
        preview: {
            primary: '#7C3AED',
            background: '#0F0F23',
            accent: '#1E1B4B'
        },
        cssVariables: {
            '--color-primary': '#7C3AED',
            '--color-primary-light': '#A78BFA',
            '--color-bg': '#000000',
            '--color-bg-container': '#0F0F23',
            '--color-bg-elevated': '#1E1B4B',
            '--color-text': '#E2E8F0',
            '--color-text-secondary': '#A5B4FC',
            '--color-text-tertiary': '#818CF8',
            '--color-border': '#312E81',
            '--color-border-secondary': 'rgba(49, 46, 129, 0.5)',
            '--color-bg-container-alpha': 'rgba(15, 15, 35, 0.6)',
            '--color-bg-elevated-alpha': 'rgba(30, 27, 75, 0.5)',
            '--color-bg-elevated-hover': 'rgba(30, 27, 75, 0.8)',
            '--color-primary-alpha-low': 'rgba(124, 58, 237, 0.1)',
            '--color-primary-alpha-medium': 'rgba(124, 58, 237, 0.3)',
            '--color-primary-alpha-hover': 'rgba(124, 58, 237, 0.12)',
            '--color-primary-shadow': 'rgba(124, 58, 237, 0.4)',
            '--color-overlay': 'rgba(0, 0, 0, 0.7)',
            '--color-overlay-border': 'rgba(255, 255, 255, 0.1)'
        },
        config: {
            algorithm: undefined,
            token: {
                colorPrimary: '#7C3AED',
                colorBgContainer: '#0F0F23',
                colorBgElevated: '#1E1B4B',
                colorBgLayout: '#000000',
                colorText: '#E2E8F0',
                colorTextSecondary: '#A5B4FC',
                colorTextTertiary: '#818CF8',
                colorBorder: '#312E81',
                colorBorderSecondary: 'rgba(49, 46, 129, 0.5)',
                borderRadius: 12,
                fontFamily: '"Inter", "Poppins", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'
            },
            components: {
                Button: {
                    colorPrimary: '#7C3AED',
                    borderRadius: 8,
                    fontWeight: 600,
                    primaryColor: '#FFFFFF'
                },
                Card: {
                    borderRadiusLG: 16
                },
                Input: {
                    hoverBorderColor: '#7C3AED',
                    activeBorderColor: '#7C3AED',
                    colorBgContainer: '#0F0F23',
                    colorBorder: '#312E81',
                    colorText: '#E2E8F0',
                    colorTextPlaceholder: '#818CF8',
                    activeShadow: '0 0 0 2px rgba(124, 58, 237, 0.2)'
                },
                Layout: {
                    bodyBg: '#000000',
                    headerBg: '#0F0F23',
                    footerBg: '#000000',
                    siderBg: '#0F0F23'
                },
                Collapse: {
                    headerPadding: 0,
                    contentPadding: 0
                },
                Tag: {
                    colorBgContainer: '#1E1B4B',
                    colorText: '#A5B4FC'
                },
                Select: {
                    colorBgContainer: '#0F0F23',
                    colorBorder: '#312E81',
                    colorText: '#E2E8F0',
                    colorTextPlaceholder: '#818CF8',
                    optionSelectedBg: 'rgba(124, 58, 237, 0.1)',
                    optionSelectedColor: '#7C3AED',
                    optionActiveBg: 'rgba(30, 27, 75, 0.8)',
                    selectorBg: '#0F0F23'
                },
                Tabs: {
                    itemColor: '#818CF8',
                    itemSelectedColor: '#7C3AED',
                    itemHoverColor: '#E2E8F0',
                    inkBarColor: '#7C3AED',
                    itemActiveColor: '#7C3AED'
                },
                Steps: {
                    colorPrimary: '#7C3AED',
                    colorText: '#E2E8F0',
                    colorTextDescription: '#818CF8',
                    colorIcon: '#818CF8',
                    colorPrimaryBorder: '#7C3AED'
                },
                Descriptions: {
                    colorText: '#E2E8F0',
                    colorTextSecondary: '#A5B4FC',
                    colorTextTertiary: '#818CF8',
                    labelColor: '#818CF8',
                    contentColor: '#A5B4FC'
                },
                Typography: {
                    colorText: '#A5B4FC',
                    colorTextSecondary: '#818CF8'
                },
                Form: {
                    labelColor: '#A5B4FC',
                    labelRequiredMarkColor: '#7C3AED'
                }
            }
        }
    }
};

export const getTheme = (themeId: ThemeId): ThemeDefinition => {
    return themes[themeId] || themes.midnight;
};

export const themeList: ThemeDefinition[] = Object.values(themes);
