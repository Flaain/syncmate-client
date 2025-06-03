import React from 'react';

import EditIcon from '@/shared/lib/assets/icons/edit.svg?react';

import { useSidebarMenu } from '@/shared/lib/hooks/useSidebarMenu';
import { SidebarMenuProps } from '@/shared/model/types';
import { Button } from '@/shared/ui/button';
import { SidebarMenuContainer, SidebarMenuHeader } from '@/shared/ui/SidebarMenu';

import { Menus, SettingMenus } from '../../model/types';
import { SettingsContent } from '../../model/view';
import { DataStorageMenu } from '../data';
import { PrivacyAndSecuityMenu } from '../privacy';
import { ProfileMenu } from '../profile';
import { ActiveSessionsMenu } from '../sessions';

import { SettingsMenuSkeleton } from './Skeleton';

export const SettingsMenu = ({ onPrevMenu }: SidebarMenuProps) => {
    const { handleBack, onAnimationEnd, setActiveMenu, onClose, activeMenu, panelRef, shouldRemove } = useSidebarMenu<SettingMenus, HTMLDivElement>(onPrevMenu);

    const menus: Menus<SettingMenus> = {
        profile: <ProfileMenu onPrevMenu={onClose} />,
        data: <DataStorageMenu onPrevMenu={onClose} />,
        privacy: <PrivacyAndSecuityMenu onPrevMenu={onClose} />,
        sessions: <ActiveSessionsMenu onPrevMenu={onClose} />
    }

    return (
        <>
            <SidebarMenuContainer
                ref={panelRef}
                shouldRemove={shouldRemove}
                hasActiveMenu={!!activeMenu}
                onBack={handleBack}
                onAnimationEnd={onAnimationEnd}
            >
                <SidebarMenuHeader title='Settings' onBack={handleBack}>
                    <Button
                        ripple
                        variant='ghost'
                        size='icon'
                        intent='secondary'
                        className='ml-auto'
                        onClick={() => setActiveMenu('profile')}
                    >
                        <EditIcon className='size-6 text-primary-gray' />
                    </Button>
                </SidebarMenuHeader>
                <React.Suspense fallback={<SettingsMenuSkeleton />}>
                    <SettingsContent changeMenu={setActiveMenu} />
                </React.Suspense>
            </SidebarMenuContainer>
            {!!activeMenu && menus[activeMenu]}
        </>
    );
};