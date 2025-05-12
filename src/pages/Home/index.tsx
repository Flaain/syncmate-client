import React from 'react';

import { RouteObject } from 'react-router-dom';

import { routerList } from '@/shared/constants';

import { View } from './model/view';

export const HomePage: RouteObject = {
    path: routerList.HOME,
    element: (
        <React.Suspense>
            <View />
        </React.Suspense>
    )
};