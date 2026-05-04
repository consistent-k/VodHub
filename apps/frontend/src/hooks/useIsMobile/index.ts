import { useSize } from 'ahooks';

const useIsMobile = () => {
    const size = useSize(() => document.body) || { width: 0, height: 0 };
    const isMobile = size.width < 800;

    return {
        isMobile
    };
};

export default useIsMobile;
