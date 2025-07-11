import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

import ArrowLeftIcon from '@/shared/lib/assets/icons/arrow_prev.svg?react';

import { outletHeaderSelector, useChat, ChatMode } from '@/shared/lib/providers/chat';
import { cn } from '@/shared/lib/utils/cn';
import { Button } from '@/shared/ui/button';

import { OutletHeaderProps } from '../model/types';

import { DefaultState } from './DefaultState';
import { SelectState } from './SelectState';

export const OutletHeader = (props: OutletHeaderProps) => {
    const { chatMode, setChat } = useChat(useShallow(outletHeaderSelector));

    const components: Record<ChatMode, React.ReactNode> = {
        default: <DefaultState {...props} />,
        selecting: <SelectState />
    };

    const navigate = useNavigate();

    const handleBack = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        navigate('/');
    };

    return (
        <div
            {...(chatMode === 'default' && { onClick: () => setChat({ showDetails: true }) })}
            className={cn(
                'flex items-center self-start size-full max-h-[56px] px-3 box-border dark:bg-primary-dark bg-primary-white sticky top-0 z-[999]',
                chatMode === 'default' && 'cursor-pointer'
            )}
        >
            <Button
                ripple
                intent='secondary'
                variant='ghost'
                size='icon'
                className='lg:hidden mr-3'
                onClick={handleBack}
            >
                <ArrowLeftIcon className='size-6 text-primary-gray' />
            </Button>
            {components[chatMode]}
        </div>
    );
};