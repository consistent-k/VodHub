import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router';
import store from 'store2';

import { useStyles } from './styles';

import { homeApi } from '@/services';

interface VodTypesProps {
    site: string;
}

interface TabItem {
    key: string;
    label: string;
}

const VodTypes: React.FC<VodTypesProps> = ({ site }) => {
    const [items, setItems] = useState<TabItem[]>([]);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { styles, cx } = useStyles();

    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const activeKey = useMemo(() => {
        if (location.pathname.includes('category')) {
            return searchParams.get('id') || '';
        }
        if (location.pathname.includes('cms')) {
            return 'all';
        }
        return '';
    }, [location.pathname, searchParams]);

    const getHome = useCallback(async (site: string) => {
        try {
            const res = await homeApi(site);
            const { code, data } = res;
            if (code === 0) {
                store.set('vod_next_home_data', data);
                const newItems = data.map((item) => ({
                    key: String(item.type_id),
                    label: item.type_name
                }));
                newItems.unshift({ key: 'all', label: '最近更新' });
                setItems(newItems);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        store.set('vod_next_home_data', []);

        getHome(site);
    }, [site, getHome]);

    const updateScrollButtons = () => {
        const container = scrollContainerRef.current;
        if (container) {
            setCanScrollLeft(container.scrollLeft > 0);
            setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 1);
        }
    };

    useEffect(() => {
        updateScrollButtons();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', updateScrollButtons);
            window.addEventListener('resize', updateScrollButtons);
            return () => {
                container.removeEventListener('scroll', updateScrollButtons);
                window.removeEventListener('resize', updateScrollButtons);
            };
        }
    }, [items]);

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = 200;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleTabClick = (key: string) => {
        if (key === 'all') {
            navigate('/cms');
        } else {
            const name = items.find((item) => item.key === key)?.label || '';
            navigate(`/category?id=${key}&name=${name}&site=${site}`);
        }
    };

    return (
        <div className={styles.vodTypes}>
            <div className={styles.tabsWrapper}>
                {canScrollLeft && (
                    <button onClick={() => scroll('left')} className={styles.scrollButton} aria-label="向左滚动">
                        <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}

                <div ref={scrollContainerRef} className={styles.tabsContainer}>
                    <div className={styles.tabsList}>
                        {items.map((item) => (
                            <button
                                key={item.key}
                                onClick={() => handleTabClick(item.key)}
                                className={cx(styles.tabItem, activeKey === item.key && styles.active)}
                                aria-selected={activeKey === item.key}
                                role="tab"
                            >
                                <span className={styles.tabLabel}>{item.label}</span>
                                {activeKey === item.key && <div className={styles.activeIndicator} />}
                            </button>
                        ))}
                    </div>
                </div>

                {canScrollRight && (
                    <button onClick={() => scroll('right')} className={styles.scrollButton} aria-label="向右滚动">
                        <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default VodTypes;
