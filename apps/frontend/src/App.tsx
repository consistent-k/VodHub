import { useMemo } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router';
import BasicLayout from './components/BasicLayout';
import InitProvider from './components/InitProvider';
import ThemeProvider from './components/ThemeProvider';
import CategoryPage from './pages/category';
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
                        <Route path="/category" element={<CategoryPage />} />
                        <Route path="/detail" element={<DetailPage />} />
                        <Route path="/setting" element={<SettingPage />} />
                    </Routes>
                </BasicLayout>
            </InitProvider>
        </ThemeProvider>
    );
}

export default App;
