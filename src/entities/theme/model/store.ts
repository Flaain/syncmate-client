import { create } from 'zustand';

import { Theme, ThemeStore } from './types';

export const useTheme = create<ThemeStore>((set) => ({
    theme: null,
    actions: {
        changeTheme: (theme: Theme) => {
            set({ theme });

            document.documentElement.classList.toggle('dark', theme === 'dark');
        }
    }
}));