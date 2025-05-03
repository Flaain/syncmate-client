import { Check, Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/shallow';

import { settingsSidebarMenuSelector, useProfile } from '@/entities/profile';

import CameraAddIcon from '@/shared/lib/assets/icons/cameraadd.svg?react';

import { BIO_MAX_LENGTH, MIN_LOGIN_LENGTH, NAME_MAX_LENGTH } from '@/shared/constants';
import { cn } from '@/shared/lib/utils/cn';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Button } from '@/shared/ui/button';
import { Image } from '@/shared/ui/Image';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { SidebarMenuSeparator } from '@/shared/ui/SidebarMenu';

import { useProfileMenu } from '../../model/useProfileMenu';

export const ProfileContent = () => {
    const { name, avatar, login, isUploadingAvatar, handleUploadAvatar } = useProfile(useShallow(settingsSidebarMenuSelector));

    const { call, onChange, isLoading, formState, canSubmit } = useProfileMenu();

    const nameSymbolsLeft = NAME_MAX_LENGTH - formState.name.value.length;
    const bioSymbolsLeft = BIO_MAX_LENGTH - formState.bio.value.length;

    return (
        <>
            <div className='flex relative justify-center items-center overflow-hidden pb-5'>
                <Label className={cn('absolute z-10 group', isUploadingAvatar ? 'cursor-not-allowed' : 'cursor-pointer')}>
                    <Input
                        type='file'
                        className='z-50 sr-only'
                        onChange={handleUploadAvatar}
                        disabled={isUploadingAvatar}
                    />
                    {isUploadingAvatar ? (<Loader2 className='size-12 text-primary-white animate-spin duration-700' />) : (<CameraAddIcon className='size-12 transition-all duration-300 group-hover:size-14 text-primary-white' />)}
                </Label>
                <Image
                    className='size-32 rounded-full self-center border border-solid border-primary-blue opacity-50'
                    src={avatar?.url}
                    skeleton={<AvatarByName name={name} className='size-32 self-center opacity-50' size='5xl' />}
                />
            </div>
            <form className='px-4 flex flex-col gap-5'>
                <Input
                    name='name'
                    label={nameSymbolsLeft <= 10 ? `Name (${nameSymbolsLeft})` : 'Name'}
                    variant={nameSymbolsLeft < 0 ? 'destructive' : 'primary'}
                    value={formState.name.value}
                    onChange={onChange}
                />
                <Input
                    name='lastName'
                    label={nameSymbolsLeft <= 10 ? `Last Name (${nameSymbolsLeft})` : 'Last Name'}
                    variant={nameSymbolsLeft < 0 ? 'destructive' : 'primary'}
                    value={formState.lastName.value}
                    onChange={onChange}
                />
                <Input
                    label={bioSymbolsLeft <= 10 ? `Bio (optional) (${bioSymbolsLeft})` : 'Bio (optional)'}
                    variant={bioSymbolsLeft < 0 ? 'destructive' : 'primary'}
                    name='bio'
                    value={formState.bio.value}
                    onChange={onChange}
                />
            </form>
            <SidebarMenuSeparator className='h-auto px-4 py-2 dark:text-primary-gray text-sm'>
                Any details such as age, occupation or city.
                <br />
                Example: 23 y.o. designer from San Francisco
            </SidebarMenuSeparator>
            <div className='p-4'>
                <Input name='username' label='Username' value={login} disabled />
            </div>
            <SidebarMenuSeparator className='h-auto px-4 py-2 text-sm dark:text-primary-gray'>
                You can use a-z, 0-9 and underscore.
                <br />
                Minimum length is {MIN_LOGIN_LENGTH} characters.
            </SidebarMenuSeparator>
            <Button
                variant='clean'
                size='icon'
                onClick={call}
                disabled={!canSubmit || isLoading}
                className={cn(
                    'absolute flex items-center justify-center rounded-full bg-primary-purple p-3 box-border right-4 bottom-5 transition-all duration-200 ease-in-out',
                    canSubmit ? 'translate-y-0' : 'translate-y-[calc(100%+20px)]'
                )}
            >
                {isLoading ? <Loader2 className='size-8 text-primary-white animate-spin' /> : <Check className='size-8 text-primary-white' />}
            </Button>
        </>
    );
};