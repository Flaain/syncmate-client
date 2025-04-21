import { useProfile } from "@/entities/profile";
import { useSession } from "@/entities/session";

import { api } from "@/shared/api";
import { noRefreshPaths } from "@/shared/constants";

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