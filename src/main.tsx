import React from 'react';
import ReactDOM from 'react-dom/client';

import { RouterProvider } from 'react-router-dom';

import { router } from './app/model/router';
import { useProfile } from './entities/profile';
import { useSession } from './entities/session';
import { ThemeProvider } from './entities/theme';
import { api } from './shared/api';
import { noRefreshPaths } from './shared/constants';

import './app/styles/index.css';

api.interceptors.response.use(undefined, async (error) => {
    if (error.response.status === 401 && !error.config._retry && !noRefreshPaths.includes(error.config.url.pathname)) {
        try {
            error.config._retry = true;
            
            await api.get('/auth/refresh');
            
            return api.call(error.config!);
        } catch (error) {
            useSession.getState().actions.onSignout();
            useProfile.setState({ profile: null! });
        }
    }
    
    return Promise.reject(error);
});

useProfile.getState().actions.getProfile();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider>
            <RouterProvider router={router} />
        </ThemeProvider>
    </React.StrictMode>
);