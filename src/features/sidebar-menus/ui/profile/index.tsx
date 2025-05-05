import React from 'react';

import { useSidebarMenu } from '@/shared/lib/hooks/useSidebarMenu';
import { SidebarMenuProps } from '@/shared/model/types';
import { SidebarMenuContainer, SidebarMenuHeader } from '@/shared/ui/SidebarMenu';

import { ProfileContent } from '../../model/view';

import { ProfileMenuSkeleton } from './ProfileMenuSkeleton';

export const ProfileMenu = ({ onClose }: SidebarMenuProps) => {
    const { panelRef, shouldRemove, onAnimationEnd, handleBack } = useSidebarMenu<null, HTMLDivElement>(onClose);

    return (
        <SidebarMenuContainer
            ref={panelRef}
            shouldRemove={shouldRemove}
            onBack={handleBack}
            onAnimationEnd={onAnimationEnd}
            className='relative !overflow-hidden'
        >
            <SidebarMenuHeader title='Edit Profile' onBack={handleBack} />
            <React.Suspense fallback={<ProfileMenuSkeleton />}>
                <ProfileContent />
            </React.Suspense>
        </SidebarMenuContainer>
    );
};