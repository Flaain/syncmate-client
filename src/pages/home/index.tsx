import { RouteObject } from 'react-router-dom';

import { routerList } from '@/shared/constants';

import { Home } from './ui/ui';

export const HomePage: RouteObject = {
    path: routerList.HOME,
    element: <Home />
};