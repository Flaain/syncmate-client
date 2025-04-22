import React from 'react';

import { RouteObject } from 'react-router-dom';

import { Guard } from '@/features/guard';

import { routerList } from '@/shared/constants';
import { AuthProvider } from '@/shared/lib/providers/auth';
import { ScreenLoader } from '@/shared/ui/ScreenLoader';

import { View } from './model/view';

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