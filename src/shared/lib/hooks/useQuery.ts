import React from 'react';

import { ApiBaseResult } from '@/shared/api/API';
import { ApiException } from '@/shared/api/error';
import { QueryCache } from '@/shared/model/queryCache';

export type UseQueryCallback<T> = (params: { signal: AbortSignal }) => Promise<ApiBaseResult<T>>;

type UseQueryReducerAction =
    | { type: UseQueryTypes.LOADING; payload: { isLoading: boolean } }
    | { type: UseQueryTypes.UPDAITING; payload: { isUpdating: boolean; } }
    | { type: UseQueryTypes.SUCCESS }
    | { type: UseQueryTypes.CACHE_SUCCESS }
    | { type: UseQueryTypes.ERROR; payload: { error: unknown } }
    | { type: UseQueryTypes.REFETCH; payload: { isRefetching: true } }
    | { type: UseQueryTypes.RESET; payload: { isLoading: false, isRefetching: false } }

type UseRunQueryAction = 'init' | 'refetch';

enum UseQueryTypes {
    LOADING = 'loading',
    UPDAITING = 'updating',
    SUCCESS = 'success',
    SET = 'set',
    REFETCH = 'refetch',
    RESET = 'reset',
    ERROR = 'error',
    CACHE_SUCCESS = 'cache_success'
}

interface UseQueryOptions<T> {
    keys: React.DependencyList;
    retry: boolean | number;
    enabled: boolean;
    refetchInterval: number;
    retryDelay: number;
    prefix: string;
    shouldUseCache: boolean;
    initialData: (() => T) | T;
    cleanup: () => void;
    onSuccess: (data: T) => void;
    onSelect: (data: T) => void;
    onError: (error: unknown) => void;
}

interface UseQueryConfig {
    currentAction: UseRunQueryAction | null;
    abortController: AbortController;
    retry: number;
    requested: boolean;
    mounted: boolean;
    interval: ReturnType<typeof setInterval> | null;
    timeout: ReturnType<typeof setTimeout> | null;
}

interface UseQueryReturn<T> {
    isLoading: boolean;
    isUpdating: boolean;
    isRefetching: boolean;
    isSuccess: boolean; 
    isCacheSuccess: boolean;
    isError: boolean;
    data: T; 
    error?: unknown;
    call: () => Promise<void>;
    abort: () => void;
    setData: React.Dispatch<React.SetStateAction<T>>;
    refetch: () => void;
}
  
interface UseQueryReducerState {
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    isRefetching: boolean;
    isUpdating: boolean;
    isCacheSuccess: boolean;
    error?: unknown;
}

const queryReducer = (state: UseQueryReducerState, action: UseQueryReducerAction): UseQueryReducerState => {
    switch (action.type) {
        case UseQueryTypes.LOADING:
            return { ...state, isLoading: action.payload.isLoading };
        case UseQueryTypes.UPDAITING:
            return { ...state, isUpdating: action.payload.isUpdating };
        case UseQueryTypes.CACHE_SUCCESS:
            return { ...state, isUpdating: false, isCacheSuccess: true, isLoading: false }
        case UseQueryTypes.SUCCESS:
            return {
                ...state,
                isUpdating: false,
                isSuccess: true,
                isLoading: false,
                isRefetching: false,
                isCacheSuccess: false,
                isError: false,
                error: undefined
            };
        case UseQueryTypes.REFETCH:
            return { ...state, isRefetching: action.payload.isRefetching };
        case UseQueryTypes.ERROR:
            return {
                ...state,
                error: action.payload.error,
                isError: true,
                isSuccess: false,
                isRefetching: false,
                isLoading: state.isUpdating && !state.isCacheSuccess
            };
        case UseQueryTypes.RESET:
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

const actions: Record<UseRunQueryAction, UseQueryReducerAction> = {
    init: { type: UseQueryTypes.LOADING, payload: { isLoading: true } },
    refetch: { type: UseQueryTypes.REFETCH, payload: { isRefetching: true } }
};

const queryCache = new QueryCache();

export const useQuery = <T>(callback: UseQueryCallback<T>, options?: Partial<UseQueryOptions<T>>): UseQueryReturn<T> => {
    const [state, dispatch] = React.useReducer(queryReducer, {
        isError: false,
        isLoading: options?.enabled ?? true,
        isSuccess: false,
        isRefetching: false,
        isCacheSuccess: false,
        isUpdating: false,
        error: undefined
    });

    const [data, setData] = React.useState<T>(options?.initialData!);

    const config = React.useRef<UseQueryConfig>({
        abortController: new AbortController(),
        currentAction: null,
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
            dispatch({ type: UseQueryTypes.UPDAITING, payload: { isUpdating: true } });

            const cache = await (await queryCache.open()).match(options!.prefix!);

            if (!cache) return;
            
            const data = await cache.json();

            if (!state.isSuccess) {
                dispatch({ type: UseQueryTypes.CACHE_SUCCESS });
                console.log('cache success', data)
                setData(options?.onSelect?.(data) ?? data);

                options?.onSuccess?.(data);
            }
        } catch (error) {
            if (retires > 0 && !state.isSuccess) return runCache(retires - 1);

            console.error(error);

            dispatch({ type: UseQueryTypes.UPDAITING, payload: { isUpdating: false } });
        }
    };

    const runQuery = async (action: UseRunQueryAction) => {
        try {
            abort();

            config.current.currentAction !== action && (dispatch(actions[action]), (config.current.currentAction = action));

            const { data, authentic } = await callback({ signal: config.current.abortController.signal });

            const selectedData = options?.onSelect?.(data) ?? data;

            dispatch({ type: UseQueryTypes.SUCCESS });

            setData(selectedData);

            options?.prefix && queryCache.open().then((cache) => cache?.put(options.prefix!, authentic));

            options?.onSuccess?.(data);

            config.current.currentAction = null;

            options?.refetchInterval && (config.current.interval = setInterval(runQuery, options.refetchInterval, 'refetch'));
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                console.log('[useQuery] Request aborted.');
                return;
            }

            if (error instanceof ApiException) {
                console.error('[useQuery] API Error:', error);

                if (error.response.status === 401) return;

                if (config.current.retry > 0) {
                    config.current.retry -= 1;

                    console.log(`[useQuery] Retrying request... (${config.current.retry} attempts left)`);

                    const timeout = setTimeout(() => {
                        runQuery(action);
                        clearTimeout(timeout);
                    }, options?.retryDelay ?? 1000);

                    config.current.timeout = timeout;
                } else {
                    dispatch({ type: UseQueryTypes.ERROR, payload: { error } });

                    config.current.requested = false;
                    config.current.currentAction = null;
                    config.current.retry = Number(options?.retry) || 0;
                }

                config.current.interval && clearInterval(config.current.interval);

                options?.onError?.(error);
            } else {
                console.error('[useQuery] Unknown Error:', error);

                dispatch({ type: UseQueryTypes.ERROR, payload: { error: error } });

                options?.onError?.(error);
            }
        }
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

    return { ...state, data, setData, abort, call: () => runQuery('init'), refetch: () => runQuery('refetch') };
};