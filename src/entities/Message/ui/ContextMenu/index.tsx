import React from 'react';

import { CheckCheck } from 'lucide-react';
import { useShallow } from 'zustand/shallow';

import { useMenuDistance } from '@/shared/lib/hooks/useMenuDistance';
import { messageContextMenuSelector, useChat } from '@/shared/lib/providers/chat';
import { ModalConfig, selectModalActions, useModal } from '@/shared/lib/providers/modal';
import { cn } from '@/shared/lib/utils/cn';
import { getRelativeMessageTimeString } from '@/shared/lib/utils/getRelativeTimeString';
import { Confirm } from '@/shared/ui/Confirm';
import { ContextMenuContent, ContextMenuSeparator } from '@/shared/ui/context-menu';
import { Typography } from '@/shared/ui/Typography';

import { useCtxMenuMessage } from '../../lib/useCtxMenuMessage';
import { ContextMenuProps } from '../../model/types';
import { ErrorContextMenu } from '../ErrorContextMenu';
import { IdleContextMenu } from '../IdleContextMenu';
import { PendingContextMenu } from '../PendingContextMenu';

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
        bodyClassName: 'h-auto p-5'
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
            className={cn('z-[999] w-[194px] py-2 px-1 dark:border-none border-none dark:bg-menu-background-color backdrop-blur-[50px] bg-primary-white rounded-[10px] flex flex-col', 
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