import React from 'react';

import { ApiBaseResult } from '@/shared/api/API';
import { ApiException } from '@/shared/api/error';
import { QueryCache } from '@/shared/model/queryCache';

export type UseQueryCallback<T> = (params: { signal: AbortSignal }) => Promise<ApiBaseResult<T>>;

type UseRunQueryAction = 'init' | 'refetch';

/**
 * Options for configuring the behavior of the `useQuery` hook.
 *
 * @template T - The type of the data returned by the query.
 */
interface UseQueryOptions<T> {
    /**
     * A list of dependencies that determine when the query should be re-executed.
     */
    keys: React.DependencyList;

    /**
     * Determines the retry behavior for failed queries. Can be a boolean to enable/disable retries
     * or a number specifying the maximum number of retry attempts.
     */
    retry: boolean | number;

    /**
     * A flag to enable or disable the query. If `false`, the query will not be executed.
     * @default true
     */
    enabled: boolean;

    /**
     * The interval (in milliseconds) at which the query should be refetched automatically.
     * Set to 0 or undefined to disable automatic refetching.
     */
    refetchInterval: number;

    /**
     * Determines whether the query should refetch when the network reconnects.
     * @default false
     */
    refetchOnReconnect: boolean;

    /**
     * The delay (in milliseconds) before retrying a failed query.
     */
    retryDelay: number;

    /**
     * A string prefix used to get and set the query cache.
     */
    prefix: string;

    /**
     * The initial data to be used by the query. Can be a value or a function that returns the value.
     */
    initialData: (() => T) | T;

    /**
     * A cleanup function that is called when the query is removed or unmounted.
     */
    cleanup: () => void;

    /**
     * A callback function that is invoked when the query successfully fetches data.
     *
     * @param data - The data returned by the query.
     * @param isCached - Optional flag indicating whether the data was retrieved from the cache.
     */
    onSuccess: (data: T, isCached?: boolean) => void;

    /**
     * A callback function that is invoked to transform or select a subset of the data.
     *
     * @param data - The data returned by the query.
     */
    onSelect: (data: T) => void;

    /**
     * A callback function that is invoked when the query encounters an error.
     *
     * @param error - The error object or value encountered during the query.
     */
    onError: (error: unknown) => void;
}

/**
 * Represents the return type of the `useQuery` hook, providing various states and methods
 * for managing asynchronous data fetching.
 *
 * @template T - The type of the data being fetched.
 */
interface UseQueryReturn<T> {
    /**
     * Indicates whether the query is currently loading data for the first time.
     */
    isLoading: boolean;

    /**
     * Indicates whether the query is currently refetching data.
     */
    isRefetching: boolean;

    /**
     * Indicates whether the query has successfully fetched data.
     */
    isSuccess: boolean;

    /**
     * Indicates whether the query has encountered an error.
     */
    isError: boolean;

    /**
     * The data returned by the query. The type of this data is determined by the generic type `T`.
     */
    data: T;

    /**
     * The error encountered during the query, if any. This is optional and may be undefined.
     */
    error?: unknown;

    /**
     * A function to manually trigger the query to fetch data.
     *
     * @returns A promise that resolves when the query completes.
     */
    call: () => Promise<void>;

    /**
     * Aborts the ongoing query request, if applicable.
     */
    abort: () => void;

    /**
     * A function to manually update the query's data state.
     *
     * @param value - A function or value to update the current data state.
     */
    setData: React.Dispatch<React.SetStateAction<T>>;

    /**
     * A function to refetch the query's data.
     */
    refetch: () => void;
}

/**
 * A custom hook for managing asynchronous queries with caching, retries, and error handling.
 * 
 * @template T - The type of the data returned by the query.
 * 
 * @param {UseQueryCallback<T>} callback - A callback function that performs the query and returns the data.
 * @param {Partial<UseQueryOptions<T>>} [options] - Optional configuration options for the query.
 * 
 * @returns {UseQueryReturn<T>} An object containing the query state, data, and utility functions.
 * 
 * @example
 * ```typescript
 * const { data, isLoading, isError, refetch } = useQuery(async () => {
 *   const response = await fetch('/api/data');
 *   return response.json();
 * }, {
 *   enabled: true,
 *   retry: 3,
 *   onSuccess: (data) => console.log('Query successful:', data),
 *   onError: (error) => console.error('Query failed:', error),
 * });
 * 
 * if (isLoading) return <div>Loading...</div>;
 * if (isError) return <div>Error occurred</div>;
 * 
 * return <div>Data: {JSON.stringify(data)}</div>;
 * ```
 */

interface UseQueryConfig {
    abortController: AbortController;
    retry: number;
    requested: boolean;
    mounted: boolean;
    interval: ReturnType<typeof setInterval> | null;
    timeout: ReturnType<typeof setTimeout> | null;
}

const queryCache = new QueryCache();

export const useQuery = <T>(callback: UseQueryCallback<T>, options?: Partial<UseQueryOptions<T>>): UseQueryReturn<T> => {
    const [isError, setIsError] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(options?.enabled ?? true);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isRefetching, setIsRefetching] = React.useState(false);
    const [isCacheSuccess, setIsCacheSuccess] = React.useState(false);
    const [isUpdating, setIsUpdating] = React.useState(false);
    
    const [error, setError] = React.useState<unknown>(undefined);
    const [data, setData] = React.useState<T>(options?.initialData!);

    const config = React.useRef<UseQueryConfig>({
        abortController: new AbortController(),
        mounted: false, 
        requested: false,
        retry: Number(options?.retry) || 0, 
        interval: null, 
        timeout: null 
    });

    const abort = () => {
        config.current.abortController.abort();
        config.current.abortController = new AbortController();

        config.current.interval && clearInterval(config.current.interval);
    };
    
    const runCache = async (retires: number = Number(options?.retry) || 0) => {
        try {
            setIsUpdating(true);

            const cache = await (await queryCache.open()).match(options!.prefix!);

            if (!cache) return;
            
            const data = await cache.json();

            setIsLoading(false);
            setIsCacheSuccess(true);

            setData(options?.onSelect?.(data) ?? data);

            options?.onSuccess?.(data, true);
        } catch (error) {
            if (retires > 0 && !isSuccess) return runCache(retires - 1);

            console.error(error);

            setIsUpdating(false);
        }
    };

    const runQuery = async (action: UseRunQueryAction) => {
        try {
            abort();

            action === 'init' ? setIsLoading(true) : setIsRefetching(true);

            const { data, authentic } = await callback({ signal: config.current.abortController.signal });

            setIsSuccess(true);
            setIsLoading(false);
            setIsUpdating(false);
            setIsCacheSuccess(false);
            setIsRefetching(false);
            setIsError(false);

            setError(undefined);
            setData(options?.onSelect?.(data) ?? data);

            options?.prefix && queryCache.open().then((cache) => cache?.put(options.prefix!, authentic)).catch((e) => console.error('[useQuery] Cache error:', e));

            options?.onSuccess?.(data, false);

            options?.refetchInterval && (config.current.interval = setInterval(runQuery, options.refetchInterval, 'refetch'));
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                console.log('[useQuery] Request aborted.');
                return;
            }

            if (error instanceof ApiException) {
                console.error('[useQuery] API Error:', error);

                if (error.config._retry && error.response.status === 401) {
                    config.current.timeout && clearTimeout(config.current.timeout);
                    return;
                }

                if (config.current.retry > 0) {
                    config.current.retry -= 1;

                    console.log(`[useQuery] Retrying request... (${config.current.retry} attempts left)`);

                    const timeout = setTimeout(() => {
                        runQuery(action);
                        clearTimeout(timeout);
                    }, options?.retryDelay ?? 1000);

                    config.current.timeout = timeout;
                } else {
                    errorSetter(error);

                    config.current.requested = false;
                    config.current.retry = Number(options?.retry) || 0;
                }

                options?.onError?.(error);
            } else {
                console.error('[useQuery] Unknown Error:', error);
                
                errorSetter(error);
                
                options?.onError?.(error);
            }

            config.current.interval && clearInterval(config.current.interval);
        }
    }

    const errorSetter = (error: unknown) => {
        setError(error);

        setIsError(true);
        setIsSuccess(false);
        setIsRefetching(false);
        setIsLoading(isUpdating && !isCacheSuccess);
    }

    React.useEffect(() => {
        config.current.mounted = true;
        
        if (!(options?.enabled ?? true)) return;

        runQuery('init');

        options?.prefix && runCache();

        return () => {
            abort();

            options?.cleanup?.();

            config.current.interval && clearInterval(config.current.interval);
            config.current.timeout && clearTimeout(config.current.timeout);
        };
    }, options?.keys ?? []);

    React.useEffect(() => {
        if (!options?.refetchOnReconnect) return;
        
        const handleRefetch = () => runQuery('init');

        window.addEventListener('online', handleRefetch);

        return () => {
            window.removeEventListener('online', handleRefetch);
        }
    }, []);

    return {
        data,
        isError: isError && !isUpdating && !isCacheSuccess,
        isLoading: isLoading || isUpdating && !isCacheSuccess,
        isRefetching,
        isSuccess,
        error,
        setData,
        abort,
        call: () => runQuery('init'),
        refetch: () => runQuery('refetch')
    };
};