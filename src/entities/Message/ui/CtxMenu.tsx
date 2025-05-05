import React from 'react';

import { CheckCheck } from 'lucide-react';

import { useMenuDistance } from '@/shared/lib/hooks/useMenuDistance';
import { useChat } from '@/shared/lib/providers/chat';
import { toast } from '@/shared/lib/toast';
import { cn } from '@/shared/lib/utils/cn';
import { getRelativeMessageTimeString } from '@/shared/lib/utils/getRelativeTimeString';
import { MessageStatus } from '@/shared/model/types';
import { ContextMenuContent, ContextMenuSeparator } from '@/shared/ui/context-menu';
import { Typography } from '@/shared/ui/Typography';

import { ContextMenuProps } from '../model/types';

import { ErrorContextMenu } from './ErrorCtxMenu';
import { IdleContextMenu } from './IdleCtxMenu';
import { PendingContextMenu } from './PendingCtxMenu';

export const CtxMenu = ({ message, isMessageFromMe, onClose }: ContextMenuProps) => {
    const [shouldRemove, setShouldRemove] = React.useState(false);

    const textareaRef = useChat((state) => state.refs.textareaRef);

    const ref = React.useRef<HTMLDivElement>(null);

    useMenuDistance<HTMLDivElement>({ ref, onClose: () => setShouldRemove(true) })

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(message.text);
        toast.success('Message copied to clipboard');
    };

    const copyCallback = () => handleItemClick(handleCopyToClipboard);
    
    const handleItemClick = (cb: () => void) => () => {
        cb();
        setShouldRemove(true);
    };

    const menus: Record<MessageStatus, React.ReactNode> = {
        idle: (
            <IdleContextMenu
                isMessageFromMe={isMessageFromMe}
                onCopy={copyCallback}
                message={message}
                onItemClick={handleItemClick}
            />
        ),
        pending: (
            <PendingContextMenu
                actions={{
                    copy: copyCallback,
                    abort: handleItemClick(message.actions?.abort!)
                }}
            />
        ),
        error: (
            <ErrorContextMenu
                actions={{
                    copy: copyCallback,
                    resend: handleItemClick(message.actions?.resend!),
                    remove: handleItemClick(message.actions?.remove!)
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
            className={cn(
                'z-[999] w-[194px] py-2 px-1 dark:border-none border-none dark:bg-menu-background-color backdrop-blur-[50px] bg-primary-white rounded-[10px] flex flex-col',
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