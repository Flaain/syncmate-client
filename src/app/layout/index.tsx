import React from 'react';

import { Guard } from '@/features/guard';

import { ScreenLoader } from '@/shared/ui/ScreenLoader';

import { LayoutProvider } from './provider';

export const baseLayout = (
    <Guard type='guest' fallback={<ScreenLoader />}>
        <React.Suspense fallback={<ScreenLoader />}>
            <LayoutProvider />
        </React.Suspense>
    </Guard>
);