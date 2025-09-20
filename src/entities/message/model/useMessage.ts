import React from 'react';

import { useShallow } from 'zustand/shallow';

import { getUseMessageSelector, useChat } from '@/shared/lib/providers/chat';

import { messageApi } from '../api';
import { MESSAGE_ENDPOINTS } from '../model/constants';
import { UseMessageProps } from '../model/types';

export const useMessage = ({ message, isMessageFromMe, isLast, isLastGroup }: UseMessageProps) => {
    const [isContextMenuOpen, setIsContextMenuOpen] = React.useState(false);

    const { params, selectedMessages, isUpdating, lastMessageRef } = useChat(useShallow(getUseMessageSelector));

    const observer = React.useRef<IntersectionObserver | null>(null);

    const ref = React.useCallback((node: HTMLLIElement) => {
        isLastGroup && isLast && (lastMessageRef.current = node);

        if (isMessageFromMe || message.alreadyRead || isUpdating) return; // So if we get chat but it's cached (isUpdating) first wait until it's updated

        observer.current?.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                messageApi.read({ endpoint: `${MESSAGE_ENDPOINTS[params.type]}/read/${message._id}`, body: JSON.stringify(params.query) });

                observer.current?.unobserve(entries[0].target);
            }
        });
        
        node && observer.current.observe(node);
    }, [isUpdating]);

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
