import React from 'react';

import { useSidebarMenu } from '@/shared/lib/hooks/useSidebarMenu';
import { SidebarMenuProps } from '@/shared/model/types';
import { SidebarMenuContainer, SidebarMenuHeader } from '@/shared/ui/SidebarMenu';

import { ActiveSessionsMenuContent } from '../../model/view';

import { ActiveSessionsMenuSkeleton } from './Skeleton';

export const ActiveSessionsMenu = ({ onPrevMenu }: SidebarMenuProps) => {
    const { panelRef, shouldRemove, onAnimationEnd, handleBack } = useSidebarMenu<null, HTMLDivElement>(onPrevMenu);

    return (
        <SidebarMenuContainer
            ref={panelRef}
            shouldRemove={shouldRemove}
            onBack={handleBack}
            onAnimationEnd={onAnimationEnd}
            className='flex flex-col'
        >
            <SidebarMenuHeader title='Active Sessions' onBack={handleBack} />
            <React.Suspense fallback={<ActiveSessionsMenuSkeleton />}>
                <ActiveSessionsMenuContent />
            </React.Suspense>
        </SidebarMenuContainer>
    );
};