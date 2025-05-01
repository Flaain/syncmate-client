import React from 'react';

import { UseQueryCallback, useQuery } from './useQuery';

interface UseInfiniteScrollOptions<T> extends IntersectionObserverInit {
    deps: React.DependencyList;
    onSuccess?: (data: T) => void;
}

export const useInfiniteScroll = <T extends HTMLElement, U>(
    callback: UseQueryCallback<U>,
    { deps, onSuccess, root, rootMargin, threshold }: UseInfiniteScrollOptions<U>
) => {
    const { isLoading, isRefetching, isError, data, error, call, refetch } = useQuery(callback, { enabled: false, onSuccess });

    const observer = React.useRef<IntersectionObserver | null>(null);

    const ref = React.useCallback((node: T) => {
        if (!isLoading && !isRefetching && deps.every(Boolean)) {
            observer.current?.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                entries[0].isIntersecting && call();
                
                observer.current?.unobserve(node);
            }, { root, rootMargin, threshold });

            node && observer.current.observe(node);
        }
    }, [deps, isLoading, isRefetching, callback, call]);

    return {
        ref,
        isLoading,
        isRefetching,
        isError,
        data,
        error,
        call,
        refetch
    };
};
