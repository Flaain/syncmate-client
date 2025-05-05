import React from "react";

import { useShallow } from "zustand/shallow";

import { useInfiniteScroll } from "@/shared/lib/hooks/useInfiniteScroll";
import { messagesListSelector, useChat } from "@/shared/lib/providers/chat";
import { getScrollBottom } from "@/shared/lib/utils/getScrollBottom";
import { DataWithCursor, Message } from "@/shared/model/types";

import { MAX_SCROLL_BOTTOM } from "./constants";
import { MessagesListProps } from "./types";
    
export const useMessagesList = (getPreviousMessages: MessagesListProps['getPreviousMessages']) => {
    const { refs: { listRef, lastMessageRef }, isUpdating, params, setChat, messages } = useChat(useShallow(messagesListSelector));

    const { isLoading, isError, isRefetching, ref, call, refetch } = useInfiniteScroll<HTMLDivElement, DataWithCursor<Array<[string, Message]>>>(({ signal }) => getPreviousMessages(params.id, messages.nextCursor!, signal), { 
        onSuccess: ({ data, nextCursor }) => setChat(({ messages }) => ({ messages: { data: new Map([...data, ...messages.data.entries()]), nextCursor } })),
        deps: [!isUpdating, messages.nextCursor],
    });

    const observer = React.useRef<IntersectionObserver | null>(null);
    const bottomPlaceholderRef = React.useRef<HTMLLIElement>(null);

    const groupedMessages = React.useMemo(() => [...messages.data.values()].reduce<Array<Array<Message>>>((acc, message) => {
        const lastGroup = acc[acc.length - 1];

        lastGroup && lastGroup[0].sender._id === message.sender._id ? lastGroup.push(message) : acc.push([message]);

        return acc;
    }, []), [messages]);

    React.useEffect(() => {
        if (!lastMessageRef.current || !listRef.current) return;

        getScrollBottom(listRef.current) < MAX_SCROLL_BOTTOM && lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages.data.size]);

    React.useEffect(() => {
        if (!bottomPlaceholderRef.current) return;

        lastMessageRef.current?.scrollIntoView({ behavior: 'instant' });

        observer.current = new IntersectionObserver((entries) => {
            setChat({ showAnchor: !entries[0].isIntersecting });
        }, { root: listRef.current, rootMargin: `0px 0px ${MAX_SCROLL_BOTTOM}px 0px` });

        observer.current.observe(bottomPlaceholderRef.current);

        return () => { observer.current?.disconnect() };
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