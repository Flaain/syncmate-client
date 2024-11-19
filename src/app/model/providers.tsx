import React from 'react';
import { ThemeProvider } from '@/entities/theme/model/provider';
import { ModalProvider } from '@/shared/lib/providers/modal';
import { useProfile } from '@/entities/profile';

useProfile.getState().actions.getProfile();

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider>
            <ModalProvider>{children}</ModalProvider>
        </ThemeProvider>
    );
};