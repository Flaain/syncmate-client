import { AppException, AppExceptionCode } from './error';


export interface BaseApi {
    baseUrl: string;
    headers?: Record<string, string>;
}

export interface ApiResponseFailureResult {
    success: Response['ok'];
    status: Response['status'];
    statusText: Response['statusText'];
    url: string;
    data: {
        message: string;
        timestamp: string;
        errorCode?: AppExceptionCode;
        errors?: Array<{ path: string; message: string }>;
    }
}

export interface ApiResponseSuccessResult<T> extends Omit<ApiResponseFailureResult, 'data'> {
    data: T;
}

export type RequestBody = Record<string, any> | FormData; 
export type InterceptorResponseSuccessFunction = <T>(response: ApiResponseSuccessResult<T>) => ApiResponseSuccessResult<T>['data'] | Promise<ApiResponseSuccessResult<T>['data']>
export type InterceptorResponseFailureFunction = (error: unknown) => any;
export type InterceptorRequestSuccessFunction = (options: RequestConfig) => RequestConfig | Promise<RequestConfig>;
export type InterceptorRequestFailureFunction = (error: unknown) => any;

export type ApiSearchParams = Record<string, string | number | boolean | Array<string | number | boolean>>;

export interface RequestConfig extends RequestInit {
    url: string;
    _retry?: boolean;
    headers?: Record<string, string>;
    params?: ApiSearchParams;
}

export interface RequestOptions extends Omit<RequestInit, 'method'> {
    headers?: Record<string, string>;
    params?: ApiSearchParams;
}

export interface RequestInterceptor {
  onSuccess?: InterceptorRequestSuccessFunction;
  onFailure?: InterceptorRequestFailureFunction;
}

export interface UseInterceptors {
    request: {
        use: (onSuccess?: InterceptorRequestSuccessFunction, onFailure?: InterceptorRequestFailureFunction) => RequestInterceptor;
        eject: (interceptor: RequestInterceptor) => boolean;
    };
    response: {
        use: (onSuccess?: InterceptorResponseSuccessFunction, onFailure?: InterceptorResponseFailureFunction) => ResponseInterceptor;
        eject: (interceptor: ResponseInterceptor) => boolean;
    }
}

export interface ResponseInterceptor {
  onSuccess?: InterceptorResponseSuccessFunction;
  onFailure?: InterceptorResponseFailureFunction;
}

export interface Interceptors {
    request: Set<RequestInterceptor>;
    response: Set<ResponseInterceptor>;
}

export abstract class ApiInterceptors {
    readonly interceptors: UseInterceptors;

    private readonly _interceptors: Interceptors = { request: new Set(), response: new Set() };

    constructor() {
        this.interceptors = {
            request: {
                use: (onSuccess, onFailure) => {
                    const interceptor = { onSuccess, onFailure };

                    this._interceptors.request.add(interceptor);

                    return interceptor;
                },
                eject: (interceptor) => this._interceptors.request.delete(interceptor)
            },
            response: {
                use: (onSuccess, onFailure) => {
                    const interceptor = { onSuccess, onFailure };

                    this._interceptors.response.add(interceptor);

                    return interceptor;
                },
                eject: (interceptor) => this._interceptors.response.delete(interceptor)
            }
        };
    }

    get requestInterceptorsSize() {
        return this._interceptors.request.size;
    }

    get responseInterceptorsSize() {
        return this._interceptors.response.size;
    }

    readonly invokeResponseInterceptors = async <T>(initialResponse: Response, initialConfig: RequestConfig) => {
        const data = await initialResponse.json();

        const response: ApiResponseSuccessResult<T>  = {
            status: initialResponse.status,
            statusText: initialResponse.statusText,
            success: initialResponse.ok,
            url: initialResponse.url,
            data
        };

        for (const { onSuccess, onFailure } of [...this._interceptors.response.values()]) {
            try {
                if (!initialResponse.ok) {
                    throw new AppException({
                        message: data.message || initialResponse.statusText,
                        config: initialConfig,
                        response: {
                            success: initialResponse.ok,
                            status: initialResponse.status,
                            statusText: initialResponse.statusText,
                            url: initialResponse.url,
                            data
                        }
                    });
                }

                if (!onSuccess) continue;

                response.data = await onSuccess(response);
            } catch (error) {
                onFailure ? (response.data = await onFailure?.(error)) : Promise.reject(error);
            }
        }

        return response;
    };

    readonly invokeRequestInterceptors = async (config: RequestConfig) => {
        for (const { onSuccess, onFailure } of [...this._interceptors.request.values()]) {
            try {
                if (!onSuccess) continue;

                config = await onSuccess(config);
            } catch (error) {
                (await onFailure?.(error)) ?? Promise.reject(error);
            }
        }

        return config;
    };
}

export class API extends ApiInterceptors {
    readonly baseUrl: BaseApi['baseUrl'];
    readonly headers: Record<string, string>;

    constructor({ baseUrl, headers = {} }: BaseApi) {
        super();

        this.baseUrl = baseUrl;
        this.headers = headers;
    }

    setHeaders = (headers: Record<string, string>) => {
        Object.assign(this.headers, headers);
    };

    private createSearchParams = (params: ApiSearchParams) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            Array.isArray(value) ? value.forEach((query) => searchParams.set(key, query.toString())) : searchParams.set(key, value.toString());
        });

        return `?${searchParams.toString()}`;
    };

    private checkResponse = async <T>(endpoint: string, method: RequestInit['method'], options: RequestOptions = {}): Promise<ApiResponseSuccessResult<T>> => {
        const initialConfig: RequestConfig = {
            ...options,
            url: endpoint,
            method,
            headers: {
                ...this.headers,
                ...(options?.body && !(options.body instanceof FormData) && { 'content-type': 'application/json' }),
                ...(!!options?.headers && options.headers)
            }
        };

        const url = this.baseUrl + endpoint + options.params ? this.createSearchParams(options.params!) : '';
        const config = await this.invokeRequestInterceptors(initialConfig);
        const response = await fetch(url, config);

        if (this.responseInterceptorsSize) return this.invokeResponseInterceptors(response, config);

        const data = await response.json();

        if (response.status >= 400) {
            throw new AppException({
                config,
                message: response.statusText,
                response: {
                    data,
                    status: response.status,
                    statusText: response.statusText,
                    success: response.ok,
                    url: response.url
                }
            });
        }

        return {
            data,
            status: response.status,
            statusText: response.statusText,
            success: response.ok,
            url: response.url
        };
    };

    get<T>(endpoint: string, options: Omit<RequestOptions, 'body'> = {}) {
        return this.checkResponse<T>(endpoint, 'GET', options);
    }

    delete<T>(endpoint: string, options: Omit<RequestOptions, 'body'> = {}) {
        return this.checkResponse<T>(endpoint, 'DELETE', options);
    }

    post<T>(endpoint: string, body?: RequestBody, options: RequestOptions = {}) {
        return this.checkResponse<T>(endpoint, 'POST', {
            ...options,
            ...(!!body && { body: body instanceof FormData ? body : JSON.stringify(body) })
        });
    }

    put<T>(endpoint: string, body?: RequestBody, options: RequestOptions = {}) {
        return this.checkResponse<T>(endpoint, 'PUT', {
            ...options,
            ...(!!body && { body: body instanceof FormData ? body : JSON.stringify(body) })
        });
    }

    patch<T>(endpoint: string, body?: RequestBody, options: RequestOptions = {}) {
        return this.checkResponse<T>(endpoint, 'PATCH', {
            ...options,
            ...(!!body && { body: body instanceof FormData ? body : JSON.stringify(body) })
        });
    }
}