// hooks/usePageLoading.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';

export const usePageLoading = () => {
    const location = useLocation();

    useEffect(() => {
        NProgress.start();
        const timeout = setTimeout(() => {
            NProgress.done();
        }, 300);

        return () => clearTimeout(timeout);
    }, [location.pathname]);
};
