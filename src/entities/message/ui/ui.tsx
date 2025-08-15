import React from 'react';

import { useShallow } from 'zustand/shallow';

import CheckIcon from '@/shared/lib/assets/icons/check.svg?react';
import CheckCheckIcon from '@/shared/lib/assets/icons/checkcheck.svg?react';
import SendingIcon from '@/shared/lib/assets/icons/sending.svg?react';
import SendingErrorIcon from '@/shared/lib/assets/icons/sendingerror.svg?react';

import { messageSelector, useChat } from '@/shared/lib/providers/chat';
import { cn } from '@/shared/lib/utils/cn';
import { ContextMenu, ContextMenuTrigger } from '@/shared/ui/context-menu';
import { MessageTail } from '@/shared/ui/MessageTail';
import { Typography } from '@/shared/ui/Typography';

import { MessageProps } from '../model/types';
import { useMessage } from '../model/useMessage';
import { getBubblesStyles } from '../utils/getBubblesStyles';

import { CtxMenu } from './CtxMenu';

export const Message = ({ message, isFirst, firstMessageRef, isLast, isLastGroup, isMessageFromMe, className, ...rest }: MessageProps) => {
    const { isContextMenuOpen, createTime, isSelected, ref, setIsContextMenuOpen } = useMessage({ message, isMessageFromMe, isLast, isLastGroup });
    const { updatedAt, text, hasBeenRead, hasBeenEdited, replyTo, inReply, status } = message;
    
    const { isContextActionsBlocked } = useChat(useShallow(messageSelector));
   
    const stylesForBottomIcon = cn('size-5', isMessageFromMe ? 'dark:text-primary-dark-200 text-primary-white' : 'dark:text-primary-white text-primary-dark-200');
    
    const statusIcons: Record<'idle' | 'pending' | 'error', React.ReactNode> = React.useMemo(() => ({
        idle: hasBeenRead ? <CheckCheckIcon className={stylesForBottomIcon} /> : <CheckIcon className={stylesForBottomIcon} />,
        pending: <SendingIcon className={stylesForBottomIcon} />,
        error: <SendingErrorIcon className={stylesForBottomIcon} />,
    }), [hasBeenRead, status]);

    return (
        <ContextMenu onOpenChange={(open) => open && setIsContextMenuOpen(true)}>
            <ContextMenuTrigger asChild disabled={isContextActionsBlocked}>
                <li
                    {...rest}
                    ref={ref}
                    className={cn(
                        'w-full flex gap-2 relative z-10 items-start',
                        !isMessageFromMe && isFirst && 'flex-col',
                        isMessageFromMe && 'justify-end after:left-1/2 after:block after:right-0 after:w-screen after:-translate-x-1/2 after:z-[-1] after:absolute after:-top-[1.5px] after:-bottom-[1.5px] after:dark:bg-primary-dark-50/50 after:opacity-0 after:transition-opacity after:duration-200 after:ease-in-out',
                        isSelected && 'after:opacity-100',
                        className
                    )}
                >
                    {isLast && (
                        <MessageTail
                            position={isMessageFromMe ? 'right' : 'left'}
                            className={cn(isMessageFromMe ? 'dark:text-primary-white text-primary-gray' : 'dark:text-primary-dark-50 text-primary-gray')}
                        />
                    )}
                    <div
                        ref={firstMessageRef}
                        className={cn(
                            'px-2 py-1 xl:m-0 relative max-w-[480px] box-border',
                            inReply && 'flex flex-col gap-2 py-1.5',
                            getBubblesStyles({ isFirst, isLast, isMessageFromMe })
                        )}
                    >
                        {inReply && (
                            <Typography
                                as='p'
                                onClick={() => console.log('replyTo', replyTo)}
                                weight='semibold'
                                className={cn(
                                    'min-w-full w-[120px] dark:text-primary-blue flex flex-col text-xs py-1 px-2 rounded bg-primary-blue/10 border-l-4 border-solid border-primary-blue'
                                )}
                            >
                                {!replyTo ? 'Deleted Message' : replyTo.sender.name}
                                {!!replyTo && (
                                    <Typography
                                        as='q'
                                        className={cn(
                                            'quotes-none text-xs overflow-hidden text-ellipsis whitespace-nowrap',
                                            isMessageFromMe
                                                ? 'dark:text-primary-dark-200 text-primary-white'
                                                : 'dark:text-primary-white text-primary-dark-50'
                                        )}
                                    >
                                        {replyTo.text}
                                    </Typography>
                                )}
                            </Typography>
                        )}
                        <Typography
                            as='p'
                            className={cn(
                                'flex items-center gap-2 flex-wrap whitespace-pre-wrap overflow-y-hidden',
                                isMessageFromMe ? 'dark:text-primary-dark-200' : 'text-primary-white'
                            )}
                        >
                            {text}
                            <Typography
                                size='xs'
                                className={cn(
                                    'ml-auto select-none flex items-center gap-2 self-end',
                                    isMessageFromMe
                                        ? 'dark:text-primary-dark-50/20 text-primary-white'
                                        : 'dark:text-primary-white/20'
                                )}
                                title={`${createTime.toLocaleString()}${hasBeenEdited ? `\nEdited: ${new Date(updatedAt).toLocaleString()}` : ''}`}
                            >
                                {createTime.toLocaleTimeString(navigator.language ?? 'en-US', { timeStyle: 'short' })}
                                {hasBeenEdited && ', edited'}
                                {isMessageFromMe && statusIcons[status ?? 'idle']}
                            </Typography>
                        </Typography>
                    </div>
                </li>
            </ContextMenuTrigger>
            {isContextMenuOpen && !isContextActionsBlocked && (
                <CtxMenu
                    message={message}
                    isMessageFromMe={isMessageFromMe}
                    onClose={() => setIsContextMenuOpen(false)}
                />
            )}
        </ContextMenu>
    );
};