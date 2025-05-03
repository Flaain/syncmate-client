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
    const alreadyIntersecting = React.useRef(false); // need to avoid infinity loop on state update

    const ref = React.useCallback((node: T) => {
        if (deps.every(Boolean)) {
            observer.current?.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (!isLoading && !isRefetching) {
                    if (entries[0].isIntersecting && !alreadyIntersecting.current) {
                        isError ? refetch() : call();
                        alreadyIntersecting.current = true;
                        // observer.current?.unobserve(node);
                    } else {
                        alreadyIntersecting.current = false;
                    }
                
                }
            }, { root, rootMargin, threshold });

            node && observer.current.observe(node);
        }
    }, [deps, isLoading, isRefetching, isError, error, callback, call]);

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
