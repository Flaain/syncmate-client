import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

import { outletHeaderSelector, useChat, ChatMode } from '@/shared/lib/providers/chat';
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
    }

    return (
        <div
            {...(chatMode === 'default' && { onClick: () => setChat({ showDetails: true }) })}
            className='flex items-center max-md:gap-5 self-start size-full max-h-[70px] px-5 py-3 box-border dark:bg-primary-dark-100 bg-primary-white sticky top-0 z-[999] cursor-pointer'
        >
            <Button variant='text' size='icon' className='md:hidden' onClick={handleBack}>
                <ArrowLeft className='size-6' />
            </Button>
            {components[chatMode]}
        </div>
    );
};
