import React from 'react';

import { useShallow } from 'zustand/shallow';

import CheckIcon from '@/shared/lib/assets/icons/check.svg?react';
import CheckCheckIcon from '@/shared/lib/assets/icons/checkcheck.svg?react';
import SendingIcon from '@/shared/lib/assets/icons/sending.svg?react';
import SendingErrorIcon from '@/shared/lib/assets/icons/sendingerror.svg?react';

import { messageSelector, useChat } from '@/shared/lib/providers/chat';
import { cn } from '@/shared/lib/utils/cn';
import { ContextMenu, ContextMenuTrigger } from '@/shared/ui/context-menu';
import { Typography } from '@/shared/ui/Typography';

import { MessageProps } from '../model/types';
import { useMessage } from '../model/useMessage';
import { getBubblesStyles } from '../utils/getBubblesStyles';

import { CtxMenu } from './CtxMenu';

export const Message = ({ message, isFirst, firstMessageRef, isLast, isLastGroup, isMessageFromMe, className, ...rest }: MessageProps) => {
    const { isContextMenuOpen, createTime, isSelected, ref, setIsContextMenuOpen } = useMessage({ message, isMessageFromMe, isLast, isLastGroup });
    const { updatedAt, text, hasBeenRead, hasBeenEdited, replyTo, inReply, status } = message;
    
    const { isContextActionsBlocked } = useChat(useShallow(messageSelector));
   
    const stylesForBottomIcon = cn('size-5 mt-0.5', isMessageFromMe ? 'dark:text-primary-dark-200 text-primary-white' : 'dark:text-primary-white text-primary-dark-200');
    
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
                        'flex gap-2 relative z-10 items-start',
                        // message.shouldAnimate && 'animate-out fill-mode-forwards scale-75 opacity-0 duration-300',
                        !isMessageFromMe && isFirst && 'flex-col',
                        isSelected && 'xl:after:-left-full after:-right-5 after:w-svw after:z-[-1] after:absolute after:-top-1 after:-bottom-1 after:dark:bg-primary-dark-50',
                        className
                    )}
                >
                    {isLast && (
                        <svg
                            width='11'
                            height='20'
                            viewBox='0 0 11 20'
                            fill='currentColor'
                            className={cn('absolute z-10 bottom-0 w-[11px] h-5', {
                                ['-right-[11px] xl:-left-[11px] dark:text-primary-white text-primary-gray max-xl:scale-x-[-1]']: isMessageFromMe,
                                ['dark:text-primary-dark-50 text-primary-gray -left-[11px]']: !isMessageFromMe
                            })}
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                d='M11 0C11 6.42858 7.76471 15.3571 1.29412 17.1429C1.29412 17.1429 0 17.1429 0 18.5714C0 20 1.29412 20 1.29412 20L11 20V0Z'
                                fill='currentColor'
                            />
                        </svg>
                    )}
                    <div
                        ref={firstMessageRef}
                        className={cn(
                            'px-2 py-1 xl:m-0 relative max-w-[480px] box-border',
                            inReply && 'flex flex-col gap-2 py-1.5',
                            getBubblesStyles({
                                isFirst,
                                isLast,
                                isMessageFromMe
                            })
                        )}
                    >
                        {inReply && (
                            <Typography
                                as='p'
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
                                            isMessageFromMe ? 'dark:text-primary-dark-200 text-primary-white' : 'dark:text-primary-white text-primary-dark-50'
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
                                size='sm'
                                className={cn(
                                    'ml-auto flex items-center gap-2 self-end',
                                    isMessageFromMe ? 'dark:text-primary-dark-50/20 text-primary-white' : 'dark:text-primary-white/20'
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