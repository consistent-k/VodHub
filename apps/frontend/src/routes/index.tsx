import { createBrowserRouter, Navigate, Outlet } from 'react-router';

import InitProvider from '@/components/InitProvider';
import ThemeProvider from '@/components/ThemeProvider';
import BasicLayout from '@/layouts/BasicLayout';
import CmsPageLayout from '@/layouts/CmsPageLayout';
import PageLayout from '@/layouts/PageLayout';
import CategoryPage from '@/pages/category';
import CmsHomePage from '@/pages/cms';
import CmsDetailPage from '@/pages/detail/cms';
import TmdbDetailPage from '@/pages/detail/tmdb';
import HomePage from '@/pages/home';
import SettingPage from '@/pages/setting';

const router = createBrowserRouter([
    {
        element: (
            <ThemeProvider>
                <InitProvider>
                    <Outlet />
                </InitProvider>
            </ThemeProvider>
        ),
        children: [
            {
                element: <BasicLayout />,
                children: [
                    {
                        element: <PageLayout />,
                        children: [
                            { index: true, element: <Navigate to="/home" replace /> },
                            { path: 'home', element: <HomePage /> },
                            { path: 'detail/cms/:vodId', element: <CmsDetailPage /> },
                            { path: 'detail/tmdb/:tmdbId', element: <TmdbDetailPage /> },
                            { path: 'setting', element: <SettingPage /> },
                            { path: '*', element: <Navigate to="/home" replace /> }
                        ]
                    },
                    {
                        element: <CmsPageLayout />,
                        children: [
                            { path: 'cms', element: <CmsHomePage /> },
                            { path: 'cms/category', element: <CategoryPage /> }
                        ]
                    }
                ]
            }
        ]
    }
]);

export default router;
