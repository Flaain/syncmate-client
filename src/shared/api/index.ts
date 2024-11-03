import { useSession } from '@/entities/session';
import { API } from './API';
import { useProfile } from '@/entities/profile';

export const api = new API({
    baseUrl: import.meta.env.VITE_BASE_URL,
    headers: {
        'Content-type': 'application/json',
        credentials: 'include'
    }
});

api.interceptors.response.use(undefined, async (error) => {
    if (error.response.status === 401 && !error.config._retry && error.config.url.pathname !== '/auth/refresh') {
        error.config._retry = true;

        try {
            await api.get('/auth/refresh');

            return api.call(error.config!);
        } catch (error) {
            useSession.getState().actions.onSignout();
            useProfile.setState({ profile: null! });
        }
    }

    Promise.reject(error);
});