import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/model/router';
import { useProfile } from './entities/profile';
import { ThemeProvider } from './entities/theme/model/provider';

import './app/styles/index.css';

document.addEventListener('DOMContentLoaded', () => document.querySelector('meta[name=viewport]')?.setAttribute('content', 'width=device-width, initial-scale=1, shrink-to-fit=no, minimum-scale=1, maximum-scale=1'));

useProfile.getState().actions.getProfile();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider>
            <RouterProvider router={router} />
        </ThemeProvider>
    </React.StrictMode>
);