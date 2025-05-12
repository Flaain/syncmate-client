export type SettingMenus = 'privacy' | 'sessions' | 'profile' | 'data';
export type PrivacyAndSecurityMenus = Extract<SettingMenus, 'sessions'>;
export type Menus<T extends string> = Record<T, React.ReactNode>;

export interface _StorageEstimate {
    quota?: number;
    usage?: number;
    usageDetails?: {
        caches?: number;
        serviceWorkerRegistrations?: number;
    };
}