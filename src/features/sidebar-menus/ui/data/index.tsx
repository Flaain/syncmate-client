import React from 'react';

import { useSidebarMenu } from '@/shared/lib/hooks/useSidebarMenu';
import { SidebarMenuProps } from '@/shared/model/types';
import { SidebarMenuContainer, SidebarMenuHeader } from '@/shared/ui/SidebarMenu';

import { DataStorageContent } from '../../model/view';

import { DataStorageMenuSkeleton } from './Skeleton';

export const DataStorageMenu = ({ onPrevMenu }: SidebarMenuProps) => {
    const { panelRef, shouldRemove, onAnimationEnd, handleBack } = useSidebarMenu<null, HTMLDivElement>(onPrevMenu);

    return (
        <SidebarMenuContainer
            ref={panelRef}
            shouldRemove={shouldRemove}
            onBack={handleBack}
            onAnimationEnd={onAnimationEnd}
        >
            <SidebarMenuHeader title='Data and Storage' onBack={handleBack} />
            <React.Suspense fallback={<DataStorageMenuSkeleton />}>
                <DataStorageContent />
            </React.Suspense>
        </SidebarMenuContainer>
    );
};