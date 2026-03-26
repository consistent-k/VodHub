'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { Loading } from '@/components/ui/Loading';
import useSettingStore from '@/lib/store/useSettingStore';
import { useVodSitesStore } from '@/lib/store/useVodSitesStore';

export function InitProvider({ children }: { children: React.ReactNode }) {
    const { getVodTypes, isInitialized, hasError } = useVodSitesStore();
    const { vod_hub_api } = useSettingStore();

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!vod_hub_api || hasError) {
            router.push('/setting');
        }
    }, [vod_hub_api, router, hasError]);

    useEffect(() => {
        if (!isInitialized && pathname !== '/setting') {
            getVodTypes({
                force: false
            });
        }
    }, [getVodTypes, isInitialized, pathname]);

    if (!isInitialized && pathname !== '/setting') {
        return <Loading fullscreen />;
    }

    if (!vod_hub_api && pathname !== '/setting') {
        return <Loading fullscreen />;
    }

    return <>{children}</>;
}
