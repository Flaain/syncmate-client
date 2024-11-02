import { API } from '@/shared/api/API';
import { Pagination } from '@/shared/model/types';
import { LocalResults } from '../model/types';
import { GroupFeed, UserFeed } from '@/widgets/Feed/types';

class SidebarAPI extends API {
    search = async (params: Pagination) => {
        const url = new URL(this._baseUrl + '/feed/search');

        const request: RequestInit = {
            headers: this._headers,
            credentials: this._cretedentials
        };

        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        return this._checkResponse<Array<UserFeed | GroupFeed>>(await fetch(url, request), request);
    };

    get = async () => {
        const request: RequestInit = {
            headers: this._headers,
            credentials: this._cretedentials
        };

        return this._checkResponse<LocalResults>(await fetch(this._baseUrl + '/feed', request), request);
    };
}

export const sidebarAPI = new SidebarAPI();