import React from 'react';
import { Guard } from '../model/Guard';
import { ScreenLoader } from '@/shared/ui/ScreenLoader';
import { Layout } from '@/shared/ui/Layout';
import { LayoutProvider } from './provider';
import { ModalProvider } from '@/shared/lib/providers/modal';

export const baseLayout = (
    <Guard type='guest' fallback={<ScreenLoader />}>
        <React.Suspense fallback={<ScreenLoader />}>
            <LayoutProvider>
                <ModalProvider>
                    <Layout />
                </ModalProvider>
            </LayoutProvider>
        </React.Suspense>
    </Guard>
);