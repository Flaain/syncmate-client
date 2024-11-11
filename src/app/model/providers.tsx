import { ThemeProvider } from '@/entities/theme/model/provider';
import { ModalProvider } from '@/shared/lib/providers/modal';

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider>
            <ModalProvider>{children}</ModalProvider>
        </ThemeProvider>
    );
};