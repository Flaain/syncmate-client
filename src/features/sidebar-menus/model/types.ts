export const PRIVACY_MODE = {
    0: 'nobody',
    1: 'everybody'
} as const;

export type SettingsSubmenu = 'data' | 'privacy' | 'sessions';
export type Menus<T extends string> = Record<T, React.ReactNode>;
export type PrivacyAndSecurityFieldWithChoose = { mode: 0; allow?: number } | { mode: 1; deny?: number };
export type PrivacyMode = keyof typeof PRIVACY_MODE;
export type PrivacyAndSecurityActiveSetting = keyof PrivacyAndSecurity | null;

export interface _StorageEstimate {
    quota?: number;
    usage?: number;
    usageDetails?: {
        caches?: number;
        serviceWorkerRegistrations?: number;
    };
}

export interface PrivacyAndSecurity {
    whoCanSeeMyEmail: PrivacyAndSecurityFieldWithChoose;
    whoCanSeeMyLastSeenTime: PrivacyAndSecurityFieldWithChoose;
    whoCanSeeMyProfilePhotos: PrivacyAndSecurityFieldWithChoose;
    whoCanSeeMyBio: PrivacyAndSecurityFieldWithChoose;
    whoCanLinkMyProfileViaForward: PrivacyAndSecurityFieldWithChoose;
    whoCanAddMeToGroupChats: PrivacyAndSecurityFieldWithChoose;
    whoCanSendMeMessages: PrivacyAndSecurityFieldWithChoose;
}

export interface PrivacyAndSecuitySettingProps {
    onModeChange: (mode: number) => void;
    activeSetting: NonNullable<PrivacyAndSecurityActiveSetting>;
    initialSettingData: PrivacyAndSecurityFieldWithChoose;
}

export interface SidebarMenuContentProps<T> {
    changeMenu: (menu: T) => void 
}