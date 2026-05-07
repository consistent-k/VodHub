import { useMemo } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router';

import InitProvider from './components/InitProvider';
import ThemeProvider from './components/ThemeProvider';
import BasicLayout from './layouts/BasicLayout';
import CategoryPage from './pages/category';
import CmsHomePage from './pages/cms';
import DetailPage from './pages/detail';
import HomePage from './pages/home';
import SettingPage from './pages/setting';

function App() {
    const location = useLocation();

    const isSettingPage = useMemo(() => {
        return location.pathname === '/setting';
    }, [location.pathname]);

    return (
        <ThemeProvider>
            <InitProvider>
                <BasicLayout isSettingPage={isSettingPage}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" replace />} />
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/cms" element={<CmsHomePage />} />
                        <Route path="/category" element={<CategoryPage />} />
                        <Route path="/detail" element={<DetailPage />} />
                        <Route path="/setting" element={<SettingPage />} />
                        <Route path="*" element={<Navigate to="/home" replace />} />
                    </Routes>
                </BasicLayout>
            </InitProvider>
        </ThemeProvider>
    );
}

export default App;
