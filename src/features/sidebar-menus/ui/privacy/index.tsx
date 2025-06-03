import React from 'react';

import { useSidebarMenu } from '@/shared/lib/hooks/useSidebarMenu';
import { SidebarMenuProps } from '@/shared/model/types';
import { SidebarMenuContainer, SidebarMenuHeader } from '@/shared/ui/SidebarMenu';

import { Menus, PrivacyAndSecurityMenus } from '../../model/types';
import { PrivacyAndSecurityMenuContent } from '../../model/view';
import { ActiveSessionsMenu } from '../sessions';

import { PrivacyAndSecurityMenuSkeleton } from './Skeleton';

export const PrivacyAndSecuityMenu = ({ onPrevMenu }: SidebarMenuProps) => {
    const { panelRef, shouldRemove, onAnimationEnd, activeMenu, setActiveMenu, onClose, handleBack } = useSidebarMenu<PrivacyAndSecurityMenus, HTMLDivElement>(onPrevMenu);

    const menus: Menus<PrivacyAndSecurityMenus> = {
        sessions: <ActiveSessionsMenu onPrevMenu={onClose} />
    }

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
                    <PrivacyAndSecurityMenuContent changeMenu={setActiveMenu} />
                </React.Suspense>
            </SidebarMenuContainer>
            {!!activeMenu && menus[activeMenu]}
        </>
    );
};