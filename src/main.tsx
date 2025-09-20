import React from 'react';
import ReactDOM from 'react-dom/client';

import { RouterProvider } from 'react-router-dom';
// eslint-disable-next-line import/no-unresolved
import { registerSW } from 'virtual:pwa-register';

import { router } from './app/model/router';
import { useProfile } from './entities/profile';
import { useSession } from './entities/session';
import { useTheme } from './entities/theme';
import { getTheme } from './entities/theme/lib/getTheme';
import { api } from './shared/api';
import { noRefreshPaths } from './shared/constants';

import './app/styles/index.css';

registerSW({ immediate: true });

api.interceptors.response.use(undefined, async (error) => {
    if (error.response.status === 401 && !error.config._retry && !noRefreshPaths.includes(error.config.url.pathname)) {
        try {
            error.config._retry = true;

            await api.get('/auth/refresh');

            return api.call(error.config!);
        } catch (error) {
            useSession.getState().actions.onSignout();
        }
    }

    return Promise.reject(error);
});

useTheme.getState().actions.changeTheme(getTheme());
useProfile.getState().actions.getProfile();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);