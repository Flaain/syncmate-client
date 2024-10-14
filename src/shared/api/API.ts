import { APIData, BaseAPI } from '../model/types';
import { AppException } from './error';

export abstract class API {
    protected readonly _baseUrl: string;
    protected readonly _headers: BaseAPI['headers'];
    protected readonly _cretedentials: BaseAPI['credentials'];
    protected readonly _noRefreshPaths: Array<string> = ['/auth/signin'];

    static readonly _refreshErrorObservers: Set<(error: AppException) => void> = new Set();
    
    constructor({
        baseUrl = import.meta.env.VITE_BASE_URL,
        headers = { 'Content-Type': 'application/json' },
        credentials = 'include'
    }: BaseAPI = {}) {
        this._baseUrl = baseUrl;
        this._headers = headers;
        this._cretedentials = credentials;
    }

    private notifyRefreshError = (error: AppException) => {
        API._refreshErrorObservers.forEach((cb) => cb(error));
    };

    private refreshToken = async () => {
        const response = await fetch(this._baseUrl + '/auth/refresh', {
            headers: this._headers,
            credentials: this._cretedentials
        });
        
        const data = await response.json();

        if (!response.ok) {
            const error: AppException = { ...data, headers: Object.fromEntries([...response.headers.entries()]) };
            
            this.notifyRefreshError(error);

            throw new AppException(error);
        }

        return data;
    }

    protected _checkResponse = async <T>(response: Response, requestInit?: RequestInit, wasRefreshed?: boolean): Promise<APIData<T>> => {
        const url = new URL(response.url);
        const data = await response.json();
        const headers = Object.fromEntries([...response.headers.entries()]);
        
        if (!response.ok) {
            const isAuthError = response.status === 401;

            if (isAuthError && !this._noRefreshPaths.includes(url.pathname) && !wasRefreshed) {
                await this.refreshToken();

                return this._checkResponse<T>(await fetch(response.url, requestInit), requestInit, true);
            } else {
                const error: AppException = { ...data, headers: Object.fromEntries([...response.headers.entries()]) };

                if (isAuthError && wasRefreshed) this.notifyRefreshError(error); else throw new AppException(error);
            }
        }

        return {
            data,
            headers,
            statusCode: response.status,
        };
    }
}