import React from 'react';

import { RouteObject } from 'react-router-dom';

import { Guard } from '@/features/Guard';

import { routerList } from '@/shared/constants';
import { ScreenLoader } from '@/shared/ui/ScreenLoader';

import { AuthProvider } from './model/store';
import { View } from './model/view';

export { useAuth } from './model/store';

export const AuthPage: RouteObject = {
    path: routerList.AUTH,
    element: (
        <Guard type='auth'>
            <React.Suspense fallback={<ScreenLoader />}>
                <AuthProvider>
                    <View />
                </AuthProvider>
            </React.Suspense>
        </Guard>
    )
};