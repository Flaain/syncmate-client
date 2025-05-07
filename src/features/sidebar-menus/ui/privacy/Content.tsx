import { useProfile } from '@/entities/profile';

import SessionsIcon from '@/shared/lib/assets/icons/devices.svg?react';

import { SidebarMenuButton } from "@/shared/ui/SidebarMenu";

import { PrivacyAndSecurityMenus } from '../../model/types';

export const PrivacyAndSecurityMenuContent = ({ changeMenu }: { changeMenu: (menu: PrivacyAndSecurityMenus) => void }) => {
    const active_sessions = useProfile((state) => state.profile.counts.active_sessions);
    
    return (
        <div className='px-4 '>
            <ul className='flex flex-col'>
                <li>
                    <SidebarMenuButton
                        onClick={() => changeMenu('sessions')}
                        icon={<SessionsIcon className='text-primary-gray' />}
                        title='Active Sessions'
                        description={ `${active_sessions} ${active_sessions > 1 ? 'devices' : 'device'}`}
                    />
                </li>
            </ul>
        </div>
    );
};