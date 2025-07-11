import React from 'react';


import { useMenuDistance } from '@/shared/lib/hooks/useMenuDistance';
import { useChat } from '@/shared/lib/providers/chat';
import { toast } from '@/shared/lib/toast';
import { cn } from '@/shared/lib/utils/cn';
import { ContextMenuContent } from '@/shared/ui/context-menu';

import { ContextMenuProps } from '../model/types';

import { IdleContextMenu } from './IdleCtxMenu';
import { SelectionCtxMenu } from './SelectionCtxMenu';
import { WithStatusCtxMenu } from './WithStatusCtxMenu';

export const CtxMenu = ({ message, isMessageFromMe, onClose }: ContextMenuProps) => {
    const [shouldRemove, setShouldRemove] = React.useState(false);

    const chatMode = useChat((state) => state.mode);
    const textareaRef = useChat((state) => state.refs.textareaRef);

    const actionRef = React.useRef<string | null | undefined>(null);
    const ref = React.useRef<HTMLDivElement>(null);

    useMenuDistance<HTMLDivElement>({ ref, onClose: () => setShouldRemove(true) })

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(message.text);
        toast.success('Message copied to clipboard');
    };
    
    const handleItemClick = (cb?: () => void, action?: string) => () => {
        cb?.();
        setShouldRemove(true);
        
        actionRef.current = action;
    };

    const copyCallback = handleItemClick(handleCopyToClipboard);
    
    return (
        <ContextMenuContent
            loop
            ref={ref}
            collisionPadding={{ bottom: 16 }}
            onInteractOutside={() => setShouldRemove(true)}
            onAnimationEnd={() => shouldRemove && onClose()}
            onEscapeKeyDown={(event) => event.preventDefault()}
            onCloseAutoFocus={() => actionRef.current === 'delete' ? setTimeout(() => textareaRef.current?.blur(), 0) : requestAnimationFrame(() => textareaRef.current?.focus())}
            className={cn(
                '!shadow-menu z-[999] w-[185px] dark:border-none border-none dark:bg-menu-background-color backdrop-blur-[40px] bg-primary-white rounded-[10px] flex flex-col',
                shouldRemove ? 'fill-mode-forwards animate-out fade-out-0 zoom-out-95' : 'animate-in fade-in-80 zoom-in-95'
            )}
        >
            {typeof message.status === 'string' && message.status !== 'idle' ? (
                <WithStatusCtxMenu
                    status={message.status}
                    actions={message.actions}
                    onItemClick={handleItemClick}
                    onCopy={copyCallback}
                />
            ) : chatMode === 'selecting' && isMessageFromMe ? (
                <SelectionCtxMenu message={message} onItemClick={handleItemClick} />
            ) : (
                <IdleContextMenu
                    isMessageFromMe={isMessageFromMe}
                    onCopy={copyCallback}
                    message={message}
                    onItemClick={handleItemClick}
                />
            )}
        </ContextMenuContent>
    );
};