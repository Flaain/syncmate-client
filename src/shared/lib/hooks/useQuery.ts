import React from 'react';
import { ApiBaseResult } from '@/shared/api/API';
import { ApiException } from '@/shared/api/error';

export type UseQueryCallback<T> = (params: { signal: AbortSignal }) => Promise<ApiBaseResult<T>>;

interface UseQueryOptions<T> {
    keys: React.DependencyList;
    retry: boolean | number;
    enabled: boolean;
    retrieveLastError: boolean;
    refetchInterval: number;
    retryDelay: number;
    onSuccess: (data: T) => void;
    onSelect: (data: T) => void;
    onError: (error: unknown) => void;
}

enum UseQueryTypes {
    LOADING = 'loading',
    SUCCESS = 'success',
    SET = 'set',
    REFETCH = 'refetch',
    RESET = 'reset',
    ERROR = 'error',
}

interface UseQueryConfig {
    abortController: AbortController;
    retry: number;
    mounted: boolean;
    interval: ReturnType<typeof setInterval> | null;
    timeout: ReturnType<typeof setTimeout> | null;
}

interface BaseQueryReturn<T> {
    isLoading: boolean;
    isRefetching: boolean;
    call: () => Promise<void>;
    abort: () => void;
    setData: (setter: Partial<T> | ((prevState: T) => Partial<T>)) => void;
    refetch: () => void;
}
  
type UseQueryReturn<T> = 
    | (BaseQueryReturn<T> & { isSuccess: true; isError: false; data: T; error?: undefined })
    | (BaseQueryReturn<T> & { isSuccess: false; isError: true; data?: undefined; error: ApiException });
  
interface UseQueryReducerState<T> {
    data?: T;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    isRefetching: boolean;
    error?: ApiException;
}

type UseQueryReducerAction<T = unknown> =
    | { type: UseQueryTypes.LOADING; payload: { isLoading: boolean } }
    | { type: UseQueryTypes.SUCCESS; payload: { data: T } }
    | { type: UseQueryTypes.ERROR; payload: { error: ApiException } }
    | { type: UseQueryTypes.REFETCH; payload: { isRefething: true } }
    | { type: UseQueryTypes.RESET; payload: { isLoading: false, isRefetching: false } }
    | { type: UseQueryTypes.SET; payload: { data: T } };

type UseRunQueryAction = 'init' | 'refetch';

const errorAction = (error: ApiException): Extract<UseQueryReducerAction, { type: UseQueryTypes.ERROR }> => ({
    type: UseQueryTypes.ERROR,
    payload: { error }
});

const queryReducer = <T>(state: UseQueryReducerState<T>, action: UseQueryReducerAction<T>) => {
    switch (action.type) {
        case UseQueryTypes.LOADING:
            return { ...state, isLoading: action.payload.isLoading };
        case UseQueryTypes.SUCCESS:
            return {
                ...state,
                data: action.payload.data,
                isSuccess: true,
                isLoading: false,
                isRefetching: false,
                isError: false,
                error: undefined
            };
        case UseQueryTypes.SET:
            return { ...state, data: action.payload.data };
        case UseQueryTypes.REFETCH:
            return { ...state, isRefetching: action.payload.isRefething };
        case UseQueryTypes.ERROR:
            return {
                ...state,
                error: action.payload.error,
                isError: true,
                isSuccess: false,
                isRefetching: false,
                isLoading: false
            };
        case UseQueryTypes.RESET:
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

export const useQuery = <T>(callback: UseQueryCallback<T>, options?: Partial<UseQueryOptions<T>>): UseQueryReturn<T> => {
    const [state, dispatch] = React.useReducer<React.Reducer<UseQueryReducerState<T>, UseQueryReducerAction<T>>>(queryReducer, {
        isError: false,
        isLoading: options?.enabled ?? true,
        isSuccess: false,
        isRefetching: false,
        data: undefined,
        error: undefined
    });

    const actions: Record<UseRunQueryAction, UseQueryReducerAction<T>> = {
        init: { type: UseQueryTypes.LOADING, payload: { isLoading: true } },
        refetch: { type: UseQueryTypes.REFETCH, payload: { isRefething: true } }
    };

    const config = React.useRef<UseQueryConfig>({
        abortController: new AbortController(),
        mounted: false, 
        retry: Number(options?.retry) || 0, 
        interval: null, 
        timeout: null 
    });

    const abort = React.useCallback(() => {
        config.current.abortController.abort();
        config.current.abortController = new AbortController();
    }, [])

    const setData = React.useCallback((setter: Partial<T> | ((prevState: T) => Partial<T>)) => {
        if (!state.data) throw new Error('Cannot set data without initial data');

        dispatch({ type: UseQueryTypes.SET, payload: { data: { ...state.data, ...(typeof setter === 'function' ? setter(state.data) : setter) } } });
    }, [state])

    const runQuery = React.useCallback(async (action: UseRunQueryAction) => {
        try {
            dispatch(actions[action]);
            if (config.current.retry) throw new ApiException({ message: 'just test', config: null!, response: null! })
            const { data } = await callback({ signal: config.current.abortController.signal });

            dispatch({ type: UseQueryTypes.SUCCESS, payload: { data: options?.onSelect?.(data) ?? data } });

            options?.onSuccess?.(data);

            if (options?.refetchInterval) {
                const interval = setInterval(() => {
                    runQuery('refetch');
                    clearInterval(interval);
                }, options.refetchInterval);

                config.current.interval = interval;
            }
        } catch (error) {
            console.log(error instanceof ApiException)
            if (error instanceof ApiException) {
                console.log(config.current)
                if (config.current.retry > 0) {
                    config.current.retry -= 1;
                    
                    const timeout = setTimeout(() => {
                        runQuery(action);
                        clearTimeout(timeout);
                    }, options?.retryDelay ?? 1000);
                    
                    config.current.timeout = timeout;
                    
                    !(options?.retrieveLastError ?? true) && dispatch(errorAction(error));
                } else {
                    dispatch(errorAction(error));
                }
                
                options?.onError?.(error);
            }
        }
    }, [callback]);

    React.useEffect(() => {
        config.current.mounted = true;

        const enabled = options?.enabled ?? true;

        enabled && runQuery('init');

        return () => {
            enabled && abort();

            config.current.interval && clearInterval(config.current.interval);
            config.current.timeout && clearTimeout(config.current.timeout);
        };
    }, options?.keys ?? []);

    return { ...state, setData, abort, call: () => runQuery('init'), refetch: () => runQuery('refetch') } as UseQueryReturn<T>;
};