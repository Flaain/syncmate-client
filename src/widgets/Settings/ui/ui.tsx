import { ChangePassword } from '@/features/ChangePassword/ui/ui';
import { MyAccount } from '@/features/MyAccount/ui/ui';
import { useModal } from '@/shared/lib/providers/modal';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/button';
import { ActiveSessions } from '@/widgets/ActiveSessions';
import Privacy from '@/widgets/Privacy/ui/ui';
import { ArrowLeft, X } from 'lucide-react';
import React from 'react';
import { useShallow } from 'zustand/shallow';
import { useSettings } from '..';
import { titles } from '../model/constants';
import { SettingMenu } from '../model/types';
import { SettingsMain } from './SettingsMain';

const components: Record<Exclude<SettingMenu, 'deleteAccount'>, React.ReactNode> = {
    main: <SettingsMain />,
    privacy: <Privacy />,
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