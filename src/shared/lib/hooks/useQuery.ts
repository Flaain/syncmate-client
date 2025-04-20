import React from 'react';
import { ApiBaseResult } from '@/shared/api/API';
import { ApiException } from '@/shared/api/error';

export type UseQueryCallback<T> = (params: { signal: AbortSignal }) => Promise<ApiBaseResult<T>>;

interface UseQueryOptions<T> {
    keys: React.DependencyList;
    retry: boolean | number;
    enabled: boolean;
    refetchInterval: number;
    retryDelay: number;
    initialData: (() => T) | T;
    cleanup: () => void;
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
    isRefetching: boolean;
    isSuccess: boolean; 
    isError: boolean; 
    data: T; 
    error?: ApiException | undefined;
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
    error?: ApiException;
}

type UseQueryReducerAction =
    | { type: UseQueryTypes.LOADING; payload: { isLoading: boolean } }
    | { type: UseQueryTypes.SUCCESS }
    | { type: UseQueryTypes.ERROR; payload: { error: ApiException } }
    | { type: UseQueryTypes.REFETCH; payload: { isRefetching: true } }
    | { type: UseQueryTypes.RESET; payload: { isLoading: false, isRefetching: false } }

type UseRunQueryAction = 'init' | 'refetch';

const errorAction = (error: ApiException): Extract<UseQueryReducerAction, { type: UseQueryTypes.ERROR }> => ({
    type: UseQueryTypes.ERROR,
    payload: { error }
});

const queryReducer = (state: UseQueryReducerState, action: UseQueryReducerAction) => {
    switch (action.type) {
        case UseQueryTypes.LOADING:
            return { ...state, isLoading: action.payload.isLoading };
        case UseQueryTypes.SUCCESS:
            return {
                ...state,
                isSuccess: true,
                isLoading: false,
                isRefetching: false,
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
                isLoading: false
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

export const useQuery = <T>(callback: UseQueryCallback<T>, options?: Partial<UseQueryOptions<T>>): UseQueryReturn<T> => {
    const [state, dispatch] = React.useReducer(queryReducer, {
        isError: false,
        isLoading: options?.enabled ?? true,
        isSuccess: false,
        isRefetching: false,
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

    const abort = React.useCallback(() => {
        config.current.abortController.abort();
        config.current.abortController = new AbortController();
    }, []);
    
    const runQuery = React.useCallback(async (action: UseRunQueryAction) => {
        try {
            abort();

            config.current.currentAction !== action && (dispatch(actions[action]), (config.current.currentAction = action));

            const { data } = await callback({ signal: config.current.abortController.signal });

            dispatch({ type: UseQueryTypes.SUCCESS });

            setData(options?.onSelect?.(data) ?? data);

            options?.onSuccess?.(data);

            config.current.currentAction = null;

            options?.refetchInterval && (config.current.interval = setInterval(runQuery, options.refetchInterval, 'refetch'));
        } catch (error) {
            if (error instanceof ApiException) {
                if (config.current.retry > 0) {
                    config.current.retry -= 1;
                    
                    const timeout = setTimeout(() => {
                        runQuery(action);
                        clearTimeout(timeout);
                    }, options?.retryDelay ?? 1000);
                    
                    config.current.timeout = timeout;
                } else {
                    dispatch(errorAction(error));

                    config.current.currentAction = null;
                }
                
                config.current.interval && clearInterval(config.current.interval);
                
                options?.onError?.(error);
            }
        }
    }, [callback]);

    React.useEffect(() => {
        config.current.mounted = true;

        (options?.enabled ?? true) && runQuery('init');

        return () => {
            abort();

            options?.cleanup?.();

            config.current.interval && clearInterval(config.current.interval);
            config.current.timeout && clearTimeout(config.current.timeout);
        };
    }, options?.keys ?? []);

    return { ...state, data, setData, abort, call: () => runQuery('init'), refetch: () => runQuery('refetch') };
};