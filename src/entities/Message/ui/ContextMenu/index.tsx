import React from 'react';
import { Typography } from '@/shared/ui/Typography';
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '@/shared/ui/context-menu';
import { CheckCheck } from 'lucide-react';
import { useMessage } from '../../lib/useMessage';
import { ContextMenuProps } from '../../model/types';
import { ModalConfig, useModal } from '@/shared/lib/providers/modal';
import { Confirm } from '@/shared/ui/Confirm';
import { selectModalActions } from '@/shared/lib/providers/modal/store';
import { useEvents } from '@/shared/model/store';
import { useShallow } from 'zustand/shallow';
import { useChat } from '@/shared/lib/providers/chat/context';
import { getRelativeMessageTimeString } from '@/shared/lib/utils/getRelativeTimeString';
import { cn } from '@/shared/lib/utils/cn';
import { IdleContextMenu } from '../IdleContextMenu';
import { PendingContextMenu } from '../PendingContextMenu';
import { ErrorContextMenu } from '../ErrorContextMenu';

export const CMItem = ({ variant = 'default', onClick, text, icon }: { variant?: 'default' | 'destructive'; text: string; icon: React.ReactNode; onClick: () => void | Promise<void> }) => (
    <ContextMenuItem
        asChild
        className={cn('active:scale-95 flex items-center gap-5 transition-colors ease-in-out duration-200 dark:text-primary-white text-primary-dark-200 rounded-md hover:bg-primary-gray focus:bg-primary-gray', variant === 'destructive' ? 'dark:hover:bg-primary-destructive/10 dark:focus:bg-primary-destructive/10' : 'dark:hover:bg-light-secondary-color dark:focus:bg-light-secondary-color')}
        onClick={onClick}
    >
        <li>
            {icon}
            <Typography size='sm' weight='medium' className={cn(variant === 'destructive' && 'dark:text-red-400')}>
                {text}
            </Typography>
        </li>
    </ContextMenuItem>
);

export const MessageContextMenu = ({ message, isMessageFromMe, onClose }: ContextMenuProps) => {
    const { handleCopyToClipboard, handleMessageDelete, handleContextAction } = useMessage(message);
    const { onOpenModal, onCloseModal } = useModal(useShallow(selectModalActions));
    const { textareaRef, handleSelectMessage } = useChat(useShallow((state) => ({
        textareaRef: state.refs.textareaRef,
        handleSelectMessage: state.actions.handleSelectMessage
    })));

    const addEventListener = useEvents((state) => state.addEventListener);

    const confirmationConfig: ModalConfig = {
        content: (
            <Confirm
                onCancel={onCloseModal()}
                onConfirm={handleMessageDelete}
                onConfirmText='Delete'
                text='Are you sure you want to delete this message?'
                onConfirmButtonVariant='destructive'
            />
        ),
        withHeader: false,
        bodyClassName: 'h-auto p-5 w-[400px]'
    };

    const menus: Record<'idle' | 'pending' | 'error', React.ReactNode> = {
        idle: (
            <IdleContextMenu
                isMessageFromMe={isMessageFromMe}
                actions={{ 
                    reply: () => handleContextAction({ state: 'reply', value: '', selectedMessage: message }),
                    copy: handleCopyToClipboard, 
                    delete: () => onOpenModal(confirmationConfig),
                    edit: () =>  handleContextAction({ state: 'edit', value: message.text, selectedMessage: message }),
                    select: () => handleSelectMessage(message)
                }}
            />
        ),
        pending: <PendingContextMenu actions={{ copy: handleCopyToClipboard, abort: message.actions?.abort! }} />,
        error: <ErrorContextMenu actions={{ copy: handleCopyToClipboard, resend: message.actions?.resend!, remove: () => message.actions?.remove! }} />
    };

    React.useEffect(() => {
        const removeEventListener = addEventListener('keydown', (event) => {
            event.key === 'Escape' && onClose();
        });

        return () => {
            removeEventListener();
        };
    }, []);

    return (
        <ContextMenuContent
            loop
            asChild
            onEscapeKeyDown={(event) => event.preventDefault()}
            onCloseAutoFocus={() => textareaRef.current?.focus()}
            className='z-[999] w-auto min-w-[200px] py-2 px-1 dark:bg-menu-background-color backdrop-blur-[50px] bg-primary-white border border-solid dark:border-primary-dark-200 border-primary-white rounded-[10px] flex flex-col'
        >
            <ul>
                <>
                    {isMessageFromMe && message.hasBeenRead && message.readedAt && (
                        <>
                            <li className='flex items-center gap-2 px-2'>
                                <CheckCheck className='size-5' />
                                <Typography size='sm'>{getRelativeMessageTimeString(message.readedAt)}</Typography>
                            </li>
                            <ContextMenuSeparator className='dark:bg-primary-dark-50 my-2' />
                        </>
                    )}
                    {menus[message.status || 'idle']}
                </>
            </ul>
        </ContextMenuContent>
    );
};