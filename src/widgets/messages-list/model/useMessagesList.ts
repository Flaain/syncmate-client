import React from "react";

import { useShallow } from "zustand/shallow";

import { ESTIMATED_MESSAGE_SIZE } from "@/shared/constants";
import { useInfiniteScroll } from "@/shared/lib/hooks/useInfiniteScroll";
import { messagesListSelector, useChat } from "@/shared/lib/providers/chat";
import { DataWithCursor, Message } from "@/shared/model/types";

import { GroupedMessages, MessagesListProps } from "./types";

export const useMessagesList = (getPreviousMessages: MessagesListProps['getPreviousMessages']) => {
    const { refs: { listRef, bottomPlaceholderRef }, isUpdating, params, setChat, messages } = useChat(useShallow(messagesListSelector));

    const { isLoading, isError, isRefetching, ref, call, refetch } = useInfiniteScroll<HTMLDivElement, DataWithCursor<Array<[string, Message]>>>(({ signal }) => getPreviousMessages(params.id, messages.nextCursor!, signal), { 
        onSuccess: ({ data, nextCursor }) => {
            React.startTransition(() => { // not sure about startTransition here but it's a heavy render
                requestAnimationFrame(() => {
                    if (!listRef.current) return;
    
                    listRef.current.scrollTop = data.length * ESTIMATED_MESSAGE_SIZE; // prevent scroll stick to the top after fetching
                });
    
                setChat(({ messages }) => ({ messages: { data: new Map([...data, ...messages.data.entries()]), nextCursor } }));
            })
        },
        deps: [!isUpdating, messages.nextCursor],
    });

    const observer = React.useRef<IntersectionObserver | null>(null);

    const groupedMessages = React.useMemo(() => Object.entries(Array.from(messages.data.values()).reduce<GroupedMessages>((acc, message) => {
        const date = new Date(message.createdAt).toDateString();
        const groupByDate = acc[date];

        if (!groupByDate) {
            acc[date] = [[message]];
        } else {
            const lastGroup = groupByDate[groupByDate.length - 1];

            message.sender._id === lastGroup[0].sender._id ? lastGroup.push(message) : groupByDate.push([message]);
        }
        
        return acc;
    }, {})), [messages]);

    React.useEffect(() => {
        if (!bottomPlaceholderRef.current || !listRef.current) return;

        requestAnimationFrame(() => bottomPlaceholderRef.current?.scrollIntoView({ behavior: 'instant' }));
    }, [isUpdating]);
    
    React.useEffect(() => {
        if (!bottomPlaceholderRef.current) return;
        
        requestAnimationFrame(() => bottomPlaceholderRef.current?.scrollIntoView({ behavior: 'instant' }));

        observer.current = new IntersectionObserver((entries) => {
            setChat({ showAnchor: !entries[0].isIntersecting });
        }, { root: listRef.current, rootMargin: `0px 0px ${100}px 0px` });

        observer.current.observe(bottomPlaceholderRef.current);

        return () => observer.current?.disconnect();
    }, [params.id]);

    return {
        bottomPlaceholderRef,
        listRef,
        firstMessageRef: ref,
        groupedMessages,
        canFetch: !isLoading && messages.nextCursor && !isUpdating,
        isLoading,
        isRefetching,
        isError,
        call,
        refetch
    };
}