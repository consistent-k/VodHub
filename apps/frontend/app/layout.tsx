import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata, Viewport } from 'next';
import React from 'react';

import BasicLayout from './layouts/BasicLayout';

import { InitProvider } from '@/components/providers/InitProvider';
import ThemeProvider from '@/components/providers/ThemeProvider';

import './globals.scss';
import 'antd/dist/reset.css';
import '@ant-design/v5-patch-for-react-19';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1.0,
    minimumScale: 1.0,
    maximumScale: 1.0,
    userScalable: false
};

export function generateMetadata(): Metadata {
    return {
        referrer: 'no-referrer',
        title: 'VodNext',
        appleWebApp: {
            title: 'VodNext',
            statusBarStyle: 'default'
        }
    };
}

const RootLayout = ({ children }: React.PropsWithChildren) => (
    <html lang="en">
        <body>
            <AntdRegistry>
                <ThemeProvider>
                    <InitProvider>
                        <BasicLayout>{children}</BasicLayout>
                    </InitProvider>
                </ThemeProvider>
            </AntdRegistry>
        </body>
    </html>
);

export default RootLayout;
