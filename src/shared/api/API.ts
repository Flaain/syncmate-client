import { ApiException, ApiExceptionCode } from './error';

export type RequestOptionsWithoutBody = Omit<RequestOptions, 'body'>;
export type RequestBody = Record<string, any> | FormData | string; 
export type InterceptorResponseSuccessFunction = <T>(response: ApiBaseResult<T>) => ApiBaseResult<T>['data'] | Promise<ApiBaseResult<T>['data']>
export type InterceptorResponseFailureFunction = (error: ApiException) => any;
export type InterceptorRequestSuccessFunction = (options: RequestConfig) => RequestConfig | Promise<RequestConfig>;
export type InterceptorRequestFailureFunction = (error: ApiException) => any;
export type ApiSearchParams = Record<string, string | number | boolean | Array<string | number | boolean>>;

export interface BaseApi {
    baseUrl: string;
    headers?: Record<string, string>;
    credentials?: RequestCredentials;
}

export interface ApiBaseResult<T> {
    success: Response['ok'];
    status: Response['status'];
    statusText: Response['statusText'];
    url: URL;
    data: T
}

export interface ApiBaseSuccessData {
    message: string;
}

export interface ApiBaseFailureData {
    message: string;
    timestamp: string;
    errorCode?: ApiExceptionCode;
    errors?: Array<{ path: string; message: string }>;
}

export interface ApiResponseFailureResult extends ApiBaseResult<ApiBaseFailureData> {
    headers: Record<string, string>;
}

export interface RequestConfig extends RequestInit {
    url: URL;
    timestamp?: string;
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

export interface InterceptorsHandlers {
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
    readonly interceptors: InterceptorsHandlers;

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

    protected get requestInterceptorsSize() {
        return this._interceptors.request.size;
    }

    protected get responseInterceptorsSize() {
        return this._interceptors.response.size;
    }

    protected readonly invokeResponseInterceptors = async <T>(initialResponse: Response, initialConfig: RequestConfig) => {
        const url = new URL(initialResponse.url);
        const data = await initialResponse.json();

        const response: ApiBaseResult<T>  = {
            url,
            data,
            status: initialResponse.status,
            statusText: initialResponse.statusText,
            success: initialResponse.ok,
        };

        for (const { onSuccess, onFailure } of [...this._interceptors.response.values()]) {
            try {
                if (!initialResponse.ok) {
                    throw new ApiException({
                        message: data.message || initialResponse.statusText,
                        config: initialConfig,
                        response: {
                            url,
                            data,
                            success: initialResponse.ok,
                            status: initialResponse.status,
                            statusText: initialResponse.statusText,
                            headers: Object.fromEntries([...initialResponse.headers.entries()])
                        }
                    });
                }

                if (!onSuccess) continue;

                response.data = await onSuccess(response);
            } catch (error) {
                error instanceof ApiException && onFailure ? (response.data = await onFailure(error)) : Promise.reject(error);
            }
        }

        return response;
    };

    protected readonly invokeRequestInterceptors = async (config: RequestConfig) => {
        if (!this.requestInterceptorsSize) return config;
        
        for (const { onSuccess, onFailure } of [...this._interceptors.request.values()]) {
            try {
                if (!onSuccess) continue;

                config = await onSuccess(config);
            } catch (error) {
                error instanceof ApiException && onFailure ? await onFailure(error) : Promise.reject(error);
            }
        }

        return config;
    };
}

export class API extends ApiInterceptors {
    readonly baseUrl: BaseApi['baseUrl'];
    readonly headers: Record<string, string>;
    readonly credentials?: RequestCredentials;

    constructor({ baseUrl, headers = {}, credentials }: BaseApi) {
        super();

        this.baseUrl = baseUrl;
        this.headers = headers;
        this.credentials = credentials;
    }

    setHeaders = (headers: Record<string, string>) => {
        Object.assign(this.headers, headers);
    };

    private request = async <T>(endpoint: string, method: RequestInit['method'], options: RequestOptions = {}): Promise<ApiBaseResult<T>> => {
        const url = new URL(endpoint, this.baseUrl);

        options.params && Object.entries(options.params).forEach(([key, value]) => {
            Array.isArray(value) ? value.forEach((query) => url.searchParams.append(key, query.toString())) : url.searchParams.set(key, value.toString());
        });

        const config = await this.invokeRequestInterceptors({
            ...options,
            credentials: this.credentials,
            url,
            method,
            headers: {
                ...this.headers,
                ...(options?.body && !(options.body instanceof FormData) && { 'content-type': 'application/json' }),
                ...(!!options?.headers && options.headers)
            }
        });
        
        const response = await fetch(url, config);

        if (this.responseInterceptorsSize) return this.invokeResponseInterceptors<T>(response, config);

        const data = await response.json();
        const responseURL = new URL(response.url);

        if (!response.ok) {
            throw new ApiException({
                config,
                message: response.statusText,
                response: {
                    data,
                    status: response.status,
                    statusText: response.statusText,
                    success: response.ok,
                    headers: Object.fromEntries([...response.headers.entries()]),
                    url: responseURL
                }
            });
        }

        return {
            data,
            status: response.status,
            statusText: response.statusText,
            success: response.ok,
            url: responseURL
        };
    };

    get = <T>(endpoint: string, options: Omit<RequestOptions, 'body'> = {}) => this.request<T>(endpoint, 'GET', options);

    delete = <T>(endpoint: string, options: Omit<RequestOptions, 'body'> = {}) => this.request<T>(endpoint, 'DELETE', options);

    post = <T>(endpoint: string, body?: RequestBody, options: RequestOptions = {}) => {
        return this.request<T>(endpoint, 'POST', {
            ...options,
            ...(!!body && { body: body instanceof FormData || typeof body === 'string' ? body : JSON.stringify(body) })
        });
    }

    put = <T>(endpoint: string, body?: RequestBody, options: RequestOptions = {}) => {
        return this.request<T>(endpoint, 'PUT', {
            ...options,
            ...(!!body && { body: body instanceof FormData || typeof body === 'string' ? body : JSON.stringify(body) })
        });
    }

    patch = <T>(endpoint: string, body?: RequestBody, options: RequestOptions = {}) => {
        return this.request<T>(endpoint, 'PATCH', {
            ...options,
            ...(!!body && { body: body instanceof FormData || typeof body === 'string' ? body : JSON.stringify(body) })
        });
    }

    call = <T>(options: RequestConfig) => this.request<T>(options.url.pathname, options.method, options);
}