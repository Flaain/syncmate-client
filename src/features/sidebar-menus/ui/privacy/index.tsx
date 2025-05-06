import SessionsIcon from '@/shared/lib/assets/icons/devices.svg?react';

import { useSidebarMenu } from '@/shared/lib/hooks/useSidebarMenu';
import { SidebarMenuProps } from '@/shared/model/types';
import { SidebarMenuButton, SidebarMenuContainer, SidebarMenuHeader } from '@/shared/ui/SidebarMenu';

export const PrivacyAnSecuityMenu = ({ onClose }: SidebarMenuProps) => {
    const { panelRef, shouldRemove, onAnimationEnd, handleBack } = useSidebarMenu<null, HTMLDivElement>(onClose);

    return (
        <SidebarMenuContainer
            ref={panelRef}
            shouldRemove={shouldRemove}
            onBack={handleBack}
            onAnimationEnd={onAnimationEnd}
            className='relative'
        >
            <SidebarMenuHeader title='Privacy and Security' onBack={handleBack} />
            <div className='px-4 '>
                <ul className='flex flex-col'>
                    <li>
                        <SidebarMenuButton icon={<SessionsIcon className='text-primary-gray' />} title='Active Sessions' className='w-full' />
                    </li>
                </ul>
            </div>
        </SidebarMenuContainer>
    );
};