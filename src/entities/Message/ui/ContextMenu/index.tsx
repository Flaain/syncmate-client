import { useMenuDistance } from '@/shared/lib/hooks/useMenuDistance';
import { messageContextMenuSelector } from '@/shared/lib/providers/chat';
import { useChat } from '@/shared/lib/providers/chat/context';
import { ModalConfig, selectModalActions, useModal } from '@/shared/lib/providers/modal';
import { cn } from '@/shared/lib/utils/cn';
import { getRelativeMessageTimeString } from '@/shared/lib/utils/getRelativeTimeString';
import { Confirm } from '@/shared/ui/Confirm';
import { Typography } from '@/shared/ui/Typography';
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '@/shared/ui/context-menu';
import { CheckCheck } from 'lucide-react';
import React from 'react';
import { useShallow } from 'zustand/shallow';
import { useCtxMenuMessage } from '../../lib/useCtxMenuMessage';
import { ContextMenuProps } from '../../model/types';
import { ErrorContextMenu } from '../ErrorContextMenu';
import { IdleContextMenu } from '../IdleContextMenu';
import { PendingContextMenu } from '../PendingContextMenu';

export const CMItem = ({ variant = 'default', onClick, text, icon }: { variant?: 'default' | 'destructive'; text: string; icon: React.ReactNode; onClick: () => void | Promise<void> }) => (
    <ContextMenuItem
        asChild
        className={cn('active:scale-95 flex items-center gap-5 transition-colors ease-in-out duration-200 dark:text-primary-white text-primary-dark-200 rounded-md hover:bg-primary-gray focus:bg-primary-gray', variant === 'destructive' ? 'dark:hover:bg-primary-destructive/10 dark:focus:bg-primary-destructive/10' : 'dark:hover:bg-light-secondary-color dark:focus:bg-light-secondary-color')}
        onClick={onClick}
    >
        <li>
            {icon}
            <Typography size='sm' weight='medium' className={cn(variant === 'destructive' && 'dark:text-primary-destructive')}>
                {text}
            </Typography>
        </li>
    </ContextMenuItem>
);

export const MessageContextMenu = ({ message, isMessageFromMe, onClose }: ContextMenuProps) => {
    const [shouldRemove, setShouldRemove] = React.useState(false);
    
    const { handleCopyToClipboard, handleMessageDelete, handleContextAction } = useCtxMenuMessage(message);
    const { onOpenModal, onCloseModal } = useModal(useShallow(selectModalActions));
    const { textareaRef, handleSelectMessage } = useChat(useShallow(messageContextMenuSelector));
    
    const ref = React.useRef<HTMLDivElement>(null);
    
    const copyCallback = React.useCallback(() => handleItemClick(handleCopyToClipboard), []);
    const handleItemClick = React.useCallback((cb: () => void) => { cb(); setShouldRemove(true); }, []);

    useMenuDistance({ ref, onClose: () => setShouldRemove(true) });

    const confirmationConfig: ModalConfig = {
        content: (
            <Confirm
                onCancel={onCloseModal}
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
                    reply: () => handleItemClick(() => handleContextAction({ state: 'reply', value: '', selectedMessage: message })),
                    copy: copyCallback,
                    delete: () => handleItemClick(() => onOpenModal(confirmationConfig)),
                    edit: () => handleItemClick(() => handleContextAction({ state: 'edit', value: message.text, selectedMessage: message })),
                    select: () => handleItemClick(() => handleSelectMessage(message))
                }}
            />
        ),
        pending: (
            <PendingContextMenu
                actions={{
                    copy: copyCallback,
                    abort: () => handleItemClick(message.actions?.abort!)
                }}
            />
        ),
        error: (
            <ErrorContextMenu
                actions={{
                    copy: copyCallback,
                    resend: () => handleItemClick(message.actions?.resend!),
                    remove: () => handleItemClick(message.actions?.remove!)
                }}
            />
        )
    };

    return (
        <ContextMenuContent
            loop
            asChild
            ref={ref}
            onInteractOutside={() => setShouldRemove(true)}
            onAnimationEnd={() => shouldRemove && onClose()}
            onEscapeKeyDown={(event) => event.preventDefault()}
            onCloseAutoFocus={() => textareaRef.current?.focus()}
            className={cn('z-[999] w-[194px] py-2 px-1 border-none dark:bg-menu-background-color backdrop-blur-[50px] bg-primary-white dark:border-primary-dark-200 border-primary-white rounded-[10px] flex flex-col', 
                shouldRemove ? 'fill-mode-forwards animate-out fade-out-0 zoom-out-95' : 'animate-in fade-in-80 zoom-in-95'
            )}
        >
            <ul>
                <>
                    {isMessageFromMe && message.hasBeenRead && message.readedAt && (
                        <>
                            <li className='flex flex-col'>
                                <div className='flex items-center gap-2 px-2'>
                                    <CheckCheck className='size-5' />
                                    <Typography size='sm'>{getRelativeMessageTimeString(message.readedAt)}</Typography>
                                </div>
                                <ContextMenuSeparator className='dark:bg-primary-dark-50 my-2' />
                            </li>
                        </>
                    )}
                    {menus[message.status || 'idle']}
                </>
            </ul>
        </ContextMenuContent>
    );
};