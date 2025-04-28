import { Check } from 'lucide-react';
import { useShallow } from 'zustand/shallow';

import { useProfile } from '@/entities/profile';

import CameraAddIcon from '@/shared/lib/assets/icons/cameraadd.svg?react';

import { NAME_MAX_LENGTH } from '@/shared/constants';
import { useSidebarMenu } from '@/shared/lib/hooks/useSidebarMenu';
import { cn } from '@/shared/lib/utils/cn';
import { SidebarMenuProps } from '@/shared/model/types';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Button } from '@/shared/ui/button';
import { Image } from '@/shared/ui/Image';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { SidebarMenuContainer, SidebarMenuHeader, SidebarMenuSeparator } from '@/shared/ui/SidebarMenu';

import { useProfileMenu } from '../../model/useProfileMenu';

export const ProfileMenu = ({ onClose }: SidebarMenuProps) => {
    const { panelRef, shouldRemove, onAnimationEnd, handleBack } = useSidebarMenu<null, HTMLDivElement>(onClose);
    const { avatar, name } = useProfile(useShallow((state) => state.profile));
    const { handleSubmit, onChange, formState, canSubmit } = useProfileMenu();

    const symbolsLeft = NAME_MAX_LENGTH - formState.name.value.length;

    return (
        <SidebarMenuContainer
            ref={panelRef}
            shouldRemove={shouldRemove}
            onAnimationEnd={onAnimationEnd}
            className='relative'
        >
            <SidebarMenuHeader title='Edit Profile' onBack={handleBack} />
            <div className='flex relative justify-center items-center overflow-hidden pb-5'>
                <Label className='absolute z-10 group cursor-pointer'>
                    <Input type='file' className='z-50 sr-only' onChange={(e) => console.log(e)} />
                    <CameraAddIcon className='size-12 transition-all duration-300 group-hover:size-14 text-primary-white' />
                </Label>
                <Image
                    className='size-32 rounded-full self-center border border-solid border-primary-blue opacity-50'
                    src={avatar?.url}
                    skeleton={<AvatarByName name={name} className='size-32 self-center opacity-50' size='5xl' />}
                />
            </div>
            <form className='px-4 flex flex-col gap-4'>
                <Input
                    label={symbolsLeft < 10 ? `Name (${symbolsLeft})` : 'Name'}
                    name='name'
                    variant={symbolsLeft < 0 ? 'destructive' : 'primary'}
                    value={formState.name.value}
                    onChange={onChange}
                />
                <Input label='Last Name' name='lastName' value={formState.lastName.value} onChange={onChange} />
                <Input label='Bio (optional)' name='bio' value={formState.bio.value} onChange={onChange} />
            </form>
            <SidebarMenuSeparator className='h-auto dark:text-primary-white/50 px-4 py-2 text-sm'>
                Any details such as age, occupation or city.
                <br />
                Example: 23 y.o. designer from San Francisco
            </SidebarMenuSeparator>
            <Button
                variant='clean'
                size='icon'
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={cn(
                    'absolute flex items-center justify-center rounded-full bg-primary-purple p-3 box-border right-4 bottom-5 transition-transform duration-200 ease-in-out',
                    canSubmit ? 'translate-y-0' : 'translate-y-[calc(100%+20px)]'
                )}
            >
                <Check className='size-8 text-primary-white' />
            </Button>
        </SidebarMenuContainer>
    );
};
