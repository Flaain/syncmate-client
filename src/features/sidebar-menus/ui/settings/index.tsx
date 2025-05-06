import React from 'react';

import EditIcon from '@/shared/lib/assets/icons/edit.svg?react';

import { useSidebarMenu } from '@/shared/lib/hooks/useSidebarMenu';
import { SidebarMenuProps } from '@/shared/model/types';
import { Button } from '@/shared/ui/button';
import { SidebarMenuContainer, SidebarMenuHeader } from '@/shared/ui/SidebarMenu';

import { SettingMenus } from '../../model/types';
import { SettingsContent } from '../../model/view';
import { DataStorageMenu } from '../data';
import { PrivacyAnSecuityMenu } from '../privacy';
import { ProfileMenu } from '../profile';

import { SettingsMenuSkeleton } from './Skeleton';

export const SettingsMenu = ({ onClose: onCloseCallback }: SidebarMenuProps) => {
    const { handleBack, onAnimationEnd, setActiveMenu, onClose, activeMenu, panelRef, shouldRemove } = useSidebarMenu<SettingMenus, HTMLDivElement>(onCloseCallback);

    const menus: Record<SettingMenus, React.ReactNode> = {
        profile: <ProfileMenu onClose={onClose} />,
        data: <DataStorageMenu onClose={onClose} />,
        privacy: <PrivacyAnSecuityMenu onClose={onClose}/>
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
                        variant='ghost'
                        size='icon'
                        className='size-10 ml-auto rounded-full p-2'
                        onClick={() => setActiveMenu('profile')}
                    >
                        <EditIcon className='size-5' />
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