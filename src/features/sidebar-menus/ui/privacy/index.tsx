import React from 'react';

import { profileApi } from '@/entities/profile';

import { useQuery } from '@/shared/lib/hooks/useQuery';
import { useSidebarMenu } from '@/shared/lib/hooks/useSidebarMenu';
import { SidebarMenuProps } from '@/shared/model/types';
import { SidebarMenuContainer, SidebarMenuHeader } from '@/shared/ui/SidebarMenu';

import { Menus, PrivacyAndSecurity, PrivacyAndSecurityActiveSetting, PrivacyAndSecurityMenus } from '../../model/types';
import { PrivacyAndSecurityMenuContent } from '../../model/view';
import { ActiveSessionsMenu } from '../sessions';

import { PrivacyAndSecuitySetting } from './Setting';
import { PrivacyAndSecurityMenuSkeleton } from './Skeleton';

export const PrivacyAndSecuityMenu = ({ onPrevMenu }: SidebarMenuProps) => {
    const { panelRef, shouldRemove, onAnimationEnd, activeMenu, changeMenu, onClose, handleBack } = useSidebarMenu<PrivacyAndSecurityMenus, HTMLDivElement>(onPrevMenu);
    const { data, setData, isLoading, isError } = useQuery(({ signal }) => profileApi.getPrivacySettings<PrivacyAndSecurity>(signal), {
        prefix: '/user/settings/privacy'
    });

    const activeSettingMenuRef = React.useRef<PrivacyAndSecurityActiveSetting>(null);

    const menus: Menus<PrivacyAndSecurityMenus> = {
        sessions: <ActiveSessionsMenu onPrevMenu={onClose} />,
        setting: (
            <PrivacyAndSecuitySetting
                data={data}
                setData={setData}
                onPrevMenu={onClose}
                activeSettingMenuRef={activeSettingMenuRef}
            />
        )
    };

    return (
        <>
            <SidebarMenuContainer
                ref={panelRef}
                hasActiveMenu={!!activeMenu}
                shouldRemove={shouldRemove}
                onBack={handleBack}
                onAnimationEnd={onAnimationEnd}
            >
                <SidebarMenuHeader title='Privacy and Security' onBack={handleBack} />
                <React.Suspense fallback={<PrivacyAndSecurityMenuSkeleton />}>
                    <PrivacyAndSecurityMenuContent
                        data={data}
                        isLoading={isLoading}
                        isError={isError}
                        changeMenu={changeMenu}
                        activeSettingMenuRef={activeSettingMenuRef}
                    />
                </React.Suspense>
            </SidebarMenuContainer>
            {!!activeMenu && menus[activeMenu]}
        </>
    );
};