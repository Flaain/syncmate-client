import React from 'react';

import { ArrowLeft, X } from 'lucide-react';
import { useShallow } from 'zustand/shallow';

import { ActiveSessions } from '@/widgets/ActiveSessions';

import { ChangePassword } from '@/features/ChangePassword';
import { MyAccount } from '@/features/MyAccount';

import { useModal } from '@/shared/lib/providers/modal';
import { Button } from '@/shared/ui/button';
import { Typography } from '@/shared/ui/Typography';

import { useSettings } from '..';
import { titles } from '../model/constants';
import { SettingMenu } from '../model/types';

import { SettingsMain } from './SettingsMain';

const components: Record<Exclude<SettingMenu, 'deleteAccount'>, React.ReactNode> = {
    main: <SettingsMain />,
    privacy: <div>privacy</div>,
    sessions: <ActiveSessions />,
    changePassword: <ChangePassword />,
    myAccount: <MyAccount />
};

export const Settings = () => {
    const { isModalDisabled, onCloseModal } = useModal(useShallow((state) => ({
        isModalDisabled: state.isModalDisabled,
        onCloseModal: state.actions.onCloseModal
    })));
    const { menu, onBack } = useSettings(useShallow((state) => ({ menu: state.menu, onBack: state.actions.onBack })));

    return (
        <div className='flex flex-col py-5'>
            <div className='flex items-center px-5 gap-5'>
                {menu !== 'main' && (
                    <Button
                        variant='text'
                        size='icon'
                        className='h-auto p-0'
                        onClick={onBack}
                        disabled={isModalDisabled}
                    >
                        <ArrowLeft className='w-6 h-6' />
                    </Button>
                )}
                <Typography as='h1' variant='primary' size='xl' weight='medium' className='self-start'>
                    {titles[menu]}
                </Typography>
                <Button
                    variant='text'
                    size='icon'
                    className='h-auto p-0 ml-auto'
                    onClick={onCloseModal}
                    disabled={isModalDisabled}
                >
                    <X className='w-6 h-6' />
                </Button>
            </div>
            {components[menu as keyof typeof components]}
        </div>
    );
};