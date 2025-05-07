export type SettingMenus = 'privacy' | 'sessions' | 'profile' | 'data';
export type PrivacyAndSecurityMenus = Extract<SettingMenus, 'sessions'>;
export type Menus<T extends string> = Record<T, React.ReactNode>;