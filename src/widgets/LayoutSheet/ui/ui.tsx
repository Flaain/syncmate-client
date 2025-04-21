import { Settings as SettingsIcon } from 'lucide-react';

import { Settings, SettingsProvider } from '@/widgets/Settings';

import { useProfile } from '@/entities/profile';

import { APP_VERSION } from '@/shared/constants';
import Verified from '@/shared/lib/assets/icons/verified.svg?react';
import { ModalConfig, useModal } from '@/shared/lib/providers/modal';
import { cn } from '@/shared/lib/utils/cn';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Button } from '@/shared/ui/button';
import { Image } from '@/shared/ui/Image';
import { Typography } from '@/shared/ui/Typography';

const listIconStyle = 'dark:text-primary-white text-primary-dark-200 w-5 h-5';

export const LayoutSheet = ({ onActionClick }: { onActionClick: () => void }) => {
    const onOpenModal = useModal((state) => state.actions.onOpenModal);
    const profile = useProfile((state) => state.profile);

    const onSheetAction = (modal: ModalConfig) => {
        onActionClick();
        onOpenModal(modal);
    };

    return (
        <div className='flex flex-col py-8 h-full'>
            <div className='flex flex-col gap-2 items-start px-4'>
                <Image
                    src={profile.avatar?.url}
                    skeleton={<AvatarByName name={profile.name} size='lg' />}
                    className='object-cover size-[50px] rounded-full'
                />
                <Typography as='h2' size='lg' weight='medium' className={cn(profile.isOfficial && 'flex items-center')}>
                    {profile.name}
                    {profile.isOfficial && (
                        <Typography className='ml-2'>
                            <Verified className='w-5 h-5' />
                        </Typography>
                    )}
                </Typography>
            </div>
            <ul className='flex flex-col gap-2'>
                <li className='first:my-4 first:py-1 first:border-y dark:first:border-primary-dark-50 first:border-primary-dark-200'>
                    <Button
                        variant='ghost'
                        className='rounded-none flex items-center justify-start gap-4 w-full'
                        onClick={() =>
                            onSheetAction({
                                content: (
                                    <SettingsProvider>
                                        <Settings />
                                    </SettingsProvider>
                                ),
                                bodyClassName: 'w-[450px] p-0 h-auto',
                                withHeader: false
                            })
                        }
                    >
                        <SettingsIcon className={listIconStyle} />
                        <Typography weight='medium'>Settings</Typography>
                    </Button>
                </li>
            </ul>
            <Typography as='p' variant='secondary' className='flex flex-col mt-auto px-4'>
                Syncmate, {new Date().getFullYear()}
                <Typography variant='secondary'>Version {APP_VERSION}</Typography>
            </Typography>
        </div>
    );
};