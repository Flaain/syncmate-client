import { createBrowserRouter } from 'react-router-dom';

import { pages } from '@/pages';

import { AuthPage } from '@/pages/auth';

import { baseLayout } from '../layout';

export const router = createBrowserRouter([{ element: baseLayout, children: pages }, AuthPage]);