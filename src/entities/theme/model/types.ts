export type Theme = 'light' | 'dark';

export interface ThemeStore {
    theme: Theme | null;
    actions: {
        changeTheme: (theme: Theme) => void;
    };
}