import { useSession } from '@/entities/session';
import { API } from './API';
import { useProfile } from '@/entities/profile';
import { noRefreshPaths } from '../constants';

export const api = new API({
    baseUrl: import.meta.env.VITE_BASE_URL,
    headers: { 'content-type': 'application/json' },
    credentials: 'include',
});

api.interceptors.response.use(undefined, async (error) => {
    if (error.response.status === 401 && !error.config._retry && !noRefreshPaths.includes(error.config.url.pathname)) {
        error.config._retry = true;
        try {
            await api.get('/auth/refresh');

            return api.call(error.config!);
        } catch (error) {
            useSession.getState().actions.onSignout();
            useProfile.setState({ profile: null! });
        }
    }

    return Promise.reject(error);
});