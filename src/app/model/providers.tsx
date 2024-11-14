import React from 'react';
import { ThemeProvider } from '@/entities/theme/model/provider';
import { ModalProvider } from '@/shared/lib/providers/modal';
import { useProfile } from '@/entities/profile';

export const Providers = ({ children }: { children: React.ReactNode }) => {
    React.useEffect(() => {
        useProfile.getState().actions.getProfile();
    }, []);

    return (
        <ThemeProvider>
            <ModalProvider>{children}</ModalProvider>
        </ThemeProvider>
    );
};