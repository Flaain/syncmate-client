import { SidebarMenuProps } from '@/shared/model/types';

export const PrivacyModeMap = {
    0: 'nobody',
    1: 'everybody'
} as const;

export type SettingMenus = 'privacy' | 'sessions' | 'profile' | 'data';
export type PrivacyAndSecurityMenus = Extract<SettingMenus, 'sessions'> | 'setting';
export type Menus<T extends string> = Record<T, React.ReactNode>;
export type PrivacyAndSecurityFieldWithChoose = { mode: 0; allow?: number } | { mode: 1; deny?: number };
export type PrivacyMode = keyof typeof PrivacyModeMap;
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

export interface PrivacyAndSecuitySettingProps extends SidebarMenuProps {
    setData: React.Dispatch<React.SetStateAction<PrivacyAndSecurity>>;
    activeSettingMenuRef: React.RefObject<PrivacyAndSecurityActiveSetting>;
    data: PrivacyAndSecurity;
}

export interface SidebarMenuContentProps<T> {
    changeMenu: (menu: T) => void 
}

export interface PrivacyAndSecurityMenuContentProps<T> extends SidebarMenuContentProps<T> {
    isLoading: boolean;
    isError: boolean;
    data: PrivacyAndSecurity;
    activeSettingMenuRef: React.RefObject<PrivacyAndSecurityActiveSetting>;
}