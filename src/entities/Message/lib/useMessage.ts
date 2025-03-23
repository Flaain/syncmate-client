import React from 'react';
import { Message } from '../model/types';
import { endpoints } from '../model/constants';
import { messageApi } from '..';
import { useChat } from '@/shared/lib/providers/chat/context';
import { useShallow } from 'zustand/shallow';
import { messageSelector } from '@/shared/lib/providers/chat/selectors';

export const useMessage = ({
    message,
    isMessageFromMe,
    isLast,
    isLastGroup
}: {
    isMessageFromMe: boolean;
    isLastGroup?: boolean;
    isLast?: boolean;
    message: Message;
}) => {
    const [isContextMenuOpen, setIsContextMenuOpen] = React.useState(false);

    const { params, selectedMessages, lastMessageRef } = useChat(useShallow(messageSelector));

    const observer = React.useRef<IntersectionObserver | null>(null);

    const ref = React.useCallback((node: HTMLLIElement) => {
        isLastGroup && isLast && (lastMessageRef.current = node);

        if (isMessageFromMe || message.alreadyRead) return;

        observer.current?.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                messageApi.read({ endpoint: `${endpoints[params.type]}/read/${message._id}`, body: JSON.stringify(params.query) });

                observer.current?.unobserve(entries[0].target);
            }
        });
        node && observer.current.observe(node);
    }, []);

    const isSelected = selectedMessages.has(message._id);
    const createTime = new Date(message.createdAt);

    return {
        isContextMenuOpen,
        setIsContextMenuOpen,
        ref,
        isSelected,
        createTime
    }
};
