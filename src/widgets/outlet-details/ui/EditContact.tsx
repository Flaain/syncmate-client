import React from 'react';

import { useShallow } from 'zustand/shallow';

import { useConversation } from '@/pages/conversation';

import CheckIcon from '@/shared/lib/assets/icons/check.svg?react';
import LoaderIcon from '@/shared/lib/assets/icons/loader.svg?react';

import { NAME_MAX_LENGTH } from '@/shared/constants';
import { useSidebarMenu } from '@/shared/lib/hooks/useSidebarMenu';
import { useSimpleForm } from '@/shared/lib/hooks/useSimpleForm';
import { cn } from '@/shared/lib/utils/cn';
import { SidebarMenuProps } from '@/shared/model/types';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Button } from '@/shared/ui/button';
import { Image } from '@/shared/ui/Image';
import { Input } from '@/shared/ui/input';
import { SidebarMenuContainer, SidebarMenuHeader, SidebarMenuSeparator } from '@/shared/ui/SidebarMenu';

export const EditContact = ({ onPrevMenu }: SidebarMenuProps) => {
    const { panelRef, shouldRemove, onAnimationEnd, handleBack } = useSidebarMenu<null, HTMLDivElement>(onPrevMenu);
    const { _id, name, avatar } = useConversation(useShallow((state) => state.conversation.recipient)); 
    // EditContact used only in conversation context so we can use this hook
    
    const { formState, canSubmit, onChange, onReset, onUpdate } = useSimpleForm({
        name: { value: name, rules: { required: true, maxLength: NAME_MAX_LENGTH } },
    });
    
    const nameSymbolsLeft = NAME_MAX_LENGTH - formState.name.value.length;

    React.useEffect(() => { onReset() }, [_id]);

    return (
        <SidebarMenuContainer
            ref={panelRef}
            shouldRemove={shouldRemove}
            onBack={handleBack}
            onAnimationEnd={onAnimationEnd}
            className='!overflow-hidden relative'
        >
            <SidebarMenuHeader title='Edit Contact' onBack={handleBack} />
            {/* <React.Suspense fallback={<SettingsMenuSkeleton />}>
                    <SettingsContent changeMenu={setActiveMenu} />
                </React.Suspense> */}
            <Image
                className='size-28 rounded-full mx-auto border border-solid border-primary-blue'
                src={avatar?.url}
                skeleton={<AvatarByName name={name} className='size-28 mx-auto' size='5xl' />}
            />
            <form className='px-4 flex flex-col gap-5 pt-4'>
                <Input
                    name='name'
                    label={nameSymbolsLeft <= 10 ? `Name (${nameSymbolsLeft})` : 'Name'}
                    variant={nameSymbolsLeft < 0 ? 'destructive' : 'primary'}
                    value={formState.name.value}
                    onChange={onChange}
                />
            </form>
            <SidebarMenuSeparator />
            <Button
                size='circle'
                // onClick={canSubmit && !isLoading ? handleSave : undefined}
                // disabled={!canSubmit || isLoading}
                className={cn('!p-0 absolute bg-primary-purple right-4 bottom-5', canSubmit ? 'translate-y-0' : 'translate-y-[calc(100%+20px)]')}
            >
                {0 ? (
                    <LoaderIcon className='size-10 text-primary-white animate-loading' />
                ) : (
                    <CheckIcon className='size-10 text-primary-white' />
                )}
            </Button>
        </SidebarMenuContainer>
    );
};