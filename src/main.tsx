import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/model/router';
import { ThemeProvider } from './entities/theme/model/provider';
import { useProfile } from './entities/profile';

import './app/styles/index.css';

useProfile.getState().actions.getProfile();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider>
            <RouterProvider router={router} />
        </ThemeProvider>
    </React.StrictMode>
);