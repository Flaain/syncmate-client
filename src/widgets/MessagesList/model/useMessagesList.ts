import { Message } from "@/entities/Message/model/types";
import { useQuery } from "@/shared/lib/hooks/useQuery";
import { messagesListSelector, useChat } from "@/shared/lib/providers/chat";
import { getScrollBottom } from "@/shared/lib/utils/getScrollBottom";
import React from "react";
import { useShallow } from "zustand/shallow";
import { MAX_SCROLL_BOTTOM, MIN_SCROLL_BOTTOM } from "./constants";
import { MessagesListProps } from "./types";
import { toast } from "@/shared/lib/toast";
    
export const useMessagesList = (getPreviousMessages: MessagesListProps['getPreviousMessages']) => {
    const { refs: { listRef, lastMessageRef }, params, setChat, messages } = useChat(useShallow(messagesListSelector));
    
    const { isLoading, isError, isRefetching, refetch, call } = useQuery(({ signal }) => getPreviousMessages(params.id, messages.nextCursor!, signal), { 
        onSuccess: ({ data, nextCursor }) => setChat(({ messages }) => {
            // ALL CODE BELOW IS TEMPORARY BECAUSE OF IOS SAFARI BUG. I KNOW IT'S BAD

            const newMessages = { ...messages, data: [...data, ...messages.data], nextCursor }, msgMap = new Map<string, Message>();

            for (const msg of newMessages.data) msgMap.set(msg._id, msg);

            const uniqueMessages = Array.from(msgMap.values());

            if (newMessages.data.length !== uniqueMessages.length) {
                toast.message('IOS_SAFARI_BUG: Duplicate messages detected.');
            }

            return { messages: { data: uniqueMessages, nextCursor } };
        }),
        retryDelay: 2000,
        enabled: false,
        retry: 5,
    });

    const groupedMessages = React.useMemo(() => messages.data.reduce<Array<Array<Message>>>((acc, message) => {
        const lastGroup = acc[acc.length - 1];

        lastGroup && lastGroup[0].sender._id === message.sender._id ? lastGroup.push(message) : acc.push([message]);

        return acc;
    }, []), [messages]);

    React.useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'instant' });
    }, [params.id]);

    React.useEffect(() => {
        if (!listRef.current) return;

        const handleScrollContainer = () => {
            const { scrollTop } = listRef.current as HTMLUListElement;

            !isLoading && !isRefetching && messages.nextCursor && !scrollTop && (isError ? refetch() : call());

            setChat({ showAnchor: getScrollBottom(listRef.current!) >= MAX_SCROLL_BOTTOM });
        };

        listRef.current?.addEventListener('scroll', handleScrollContainer);

        return () => {
            listRef.current?.removeEventListener('scroll', handleScrollContainer);
        };
    }, [messages.nextCursor, isLoading, isRefetching, isError, call, refetch]);

    React.useEffect(() => {
        if (!listRef.current || !lastMessageRef.current) return;

        const scrollBottom = getScrollBottom(listRef.current!);

        scrollBottom <= MIN_SCROLL_BOTTOM ? lastMessageRef.current.scrollIntoView({ behavior: 'smooth' }) : setChat({ showAnchor: scrollBottom >= MAX_SCROLL_BOTTOM });
    }, [messages]);

    return {
        listRef,
        groupedMessages,
        canFetch: !!(!isLoading && messages.nextCursor),
        isLoading,
        isRefetching,
        isError,
        call,
        refetch
    };
}