import Verified from '@/shared/lib/assets/icons/verified.svg?react';
import { Switch } from '@/shared/ui/Switch';
import { Typography } from '@/shared/ui/Typography';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Image } from '@/shared/ui/Image';
import { Button } from '@/shared/ui/button';
import { Archive, Moon, Users, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';
import { ModalConfig, useModal } from '@/shared/lib/providers/modal';
import { useTheme } from '@/entities/theme';
import { SettingsProvider, Settings } from '@/widgets/Settings';
import { useLayout } from '@/shared/model/store';
import { useProfile } from '@/entities/profile';
import { CreateGroup, CreateGroupProvider } from '@/features/CreateGroup';
import { APP_VERSION } from '@/shared/constants';

const listIconStyle = 'dark:text-primary-white text-primary-dark-200 w-5 h-5';

export const LayoutSheet = () => {
    const onOpenModal = useModal((state) => state.actions.onOpenModal);
    const profile = useProfile((state) => state.profile);
    const theme = useTheme((state) => state.theme);

    const onSheetAction = (modal: ModalConfig) => {
        useLayout.setState({ isSheetOpen: false });
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
                    <Button variant='ghost' className='rounded-none flex items-center justify-start gap-4 w-full'>
                        <Archive className={listIconStyle} />
                        <Typography weight='medium'>Archived chats</Typography>
                    </Button>
                </li>
                <li className='first:my-4 first:py-1 first:border-y dark:first:border-primary-dark-50 first:border-primary-dark-200'>
                    <Button
                        variant='ghost'
                        className='rounded-none flex items-center justify-start gap-4 w-full'
                        onClick={() =>
                            onSheetAction({
                                withHeader: false,
                                content: (
                                    <CreateGroupProvider>
                                        <CreateGroup />
                                    </CreateGroupProvider>
                                ),
                                bodyClassName: 'w-[450px] p-3 h-auto'
                            })
                        }
                    >
                        <Users className={listIconStyle} />
                        <Typography weight='medium'>New Group</Typography>
                    </Button>
                </li>
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
                <li className='flex items-center'>
                    <Switch
                        checked={theme === 'dark'}
                        checkboxClassName='ml-auto dark:bg-primary-white transition-colors ease-in-out duration-200'
                        className='h-10 px-4 py-2 text-primary-dark-200 hover:bg-primary-white dark:text-primary-white dark:hover:bg-primary-dark-50 flex items-center cursor-pointer rounded-none justify-start gap-4 w-full'
                        onChange={() => useTheme.setState({ theme: theme === 'dark' ? 'light' : 'dark' })}
                    >
                        <Moon className={listIconStyle} />
                        <Typography weight='medium'>Night Mode</Typography>
                    </Switch>
                </li>
            </ul>
            <Typography as='p' variant='secondary' className='flex flex-col mt-auto px-4'>
                FChat Web, {new Date().getFullYear()}
                <Typography variant='secondary'>Version {APP_VERSION}</Typography>
            </Typography>
        </div>
    );
};