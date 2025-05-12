import React from "react";

import { useQuery } from "@/shared/lib/hooks/useQuery";
import { socketSelector } from "@/shared/model/selectors";
import { useLayout, useSocket } from "@/shared/model/store";
import { PRESENCE } from "@/shared/model/types";
import { TypingParticipant } from "@/shared/ui/Typography";

import { feedApi } from "../api";
import { getFilteredGlobalResults, getFilteredLocalResults } from "../utils/feedFilters";
import { getSortedFeedByLastMessage } from "../utils/getSortedFeed";

import { FEED_EVENT, FEED_TYPE, FeedProps, FeedUnreadCounterEvent, FeedUpdateParams, LocalFeed, LocalResults } from "./types";

export const useFeed = ({ searchValue, globalResults }: Omit<FeedProps, 'isSearching'>) => {
    const socket = useSocket(socketSelector);

    const { data: localResults, isLoading, setData: setLocalResults } = useQuery<LocalResults>(({ signal }) => feedApi.get(signal), { 
        retry: 5,
        initialData: { feed: [], nextCursor: null }
    });

    const filteredLocalResults = React.useMemo(() => localResults?.feed.filter((item) => getFilteredLocalResults(item, searchValue)), [localResults, searchValue]);
    const filteredGlobalResults = React.useMemo(() => globalResults?.items.filter((item) => !getFilteredGlobalResults(item, filteredLocalResults)), [globalResults, filteredLocalResults]);
    
    React.useEffect(() => {
        socket?.on(FEED_EVENT.CREATE, (createFeedItem: LocalFeed, shouldNotify?: boolean) => {
            setLocalResults((prevState) => {
                const index = prevState.feed.findIndex((feedItem) => feedItem._id === createFeedItem._id);

                if (index !== -1) {
                    const feed = [...prevState.feed];
                    
                    feed[index] = {
                        ...feed[index],
                        lastActionAt: createFeedItem.lastActionAt,
                        item: { ...feed[index].item, ...createFeedItem.item }
                    }
                    
                    return { ...prevState, feed: feed.sort(getSortedFeedByLastMessage) };
                }

                return { ...prevState, feed: [createFeedItem, ...prevState.feed] }
            });

            shouldNotify && useLayout.getState().actions.playSound('new_message');
        });

        socket?.on(FEED_EVENT.USER_PRESENCE, ({ recipientId, presence }: { recipientId: string; presence: PRESENCE }) => {
            setLocalResults((prevState) => ({
                ...prevState,
                feed: prevState.feed.map((feedItem) => {
                    if (feedItem.type === FEED_TYPE.CONVERSATION && feedItem.item.recipient._id === recipientId) {
                        return {
                            ...feedItem,
                            item: { ...feedItem.item, recipient: { ...feedItem.item.recipient, presence } }
                        };
                    }

                    return feedItem;
                })
            }));
        });

        socket?.on(FEED_EVENT.UPDATE, ({ itemId, lastActionAt, lastMessage, shouldSort }: FeedUpdateParams) => {
            setLocalResults((prevState) => { 
                const updatedFeed = prevState.feed.map((feedItem) => {
                    if (feedItem.item._id === itemId) {
                        return {
                            ...feedItem,
                            lastActionAt: lastActionAt ?? feedItem.lastActionAt,
                            item: { ...feedItem.item, lastMessage: !lastMessage ? undefined : { ...feedItem.item.lastMessage, ...lastMessage } }
                        };
                    }

                    return feedItem;
                });
    
                return {
                    ...prevState,
                    feed: shouldSort ? updatedFeed.sort(getSortedFeedByLastMessage) : updatedFeed
                };
            })
        });

        socket?.on(FEED_EVENT.UNREAD_COUNTER, ({ itemId, count, action }: FeedUnreadCounterEvent) => {
            const actions: Record<typeof action, (unreadMessages?: number) => number> = {
                set: () => count ?? 0,
                dec: (unread) => Math.max((unread ?? 0) - (count ?? 1), 0)
            };

            setLocalResults((prevState) => {
                return {
                    ...prevState,
                    feed: prevState.feed.map((feedItem) => {
                        if (feedItem.item._id === itemId) {
                            return {
                                ...feedItem,
                                item: {
                                    ...feedItem.item,
                                    unreadMessages: actions[action](feedItem.item.unreadMessages)
                                }
                            };
                        }

                        return feedItem;
                    })
                };
            });
        });

        socket?.on(FEED_EVENT.DELETE, (id: string) => {
            setLocalResults((prevState) => ({
                ...prevState,
                feed: prevState.feed.filter((feedItem) => feedItem.item._id !== id).sort(getSortedFeedByLastMessage)
            }));
        });

        socket?.on(FEED_EVENT.START_TYPING, (data: { _id: string; participant: TypingParticipant }) => {
            setLocalResults((prevState) => ({
                ...prevState,
                feed: prevState.feed.map((feedItem) => {
                    if (feedItem.item._id === data._id) {
                        return {
                            ...feedItem,
                            item: {
                                ...feedItem.item,
                                participantsTyping: [data.participant]
                            }
                        };
                    }

                    return feedItem;
                })
            }));
        });

        socket?.on(FEED_EVENT.STOP_TYPING, (data: { _id: string; participant: Omit<TypingParticipant, 'name'> }) => {
            setLocalResults((prevState) => ({
                ...prevState,
                feed: prevState.feed.map((feedItem) => {
                    if (feedItem.item._id === data._id) {
                        return {
                            ...feedItem,
                            item: { ...feedItem.item, participantsTyping: [] }
                        };
                    }

                    return feedItem;
                })
            }));
        })

        return () => {
            socket?.off(FEED_EVENT.UNREAD_COUNTER);

            socket?.off(FEED_EVENT.CREATE);
            socket?.off(FEED_EVENT.UPDATE);
            socket?.off(FEED_EVENT.DELETE);
            
            socket?.off(FEED_EVENT.START_TYPING);
            socket?.off(FEED_EVENT.STOP_TYPING);

            socket?.off(FEED_EVENT.USER_PRESENCE);
        };
    }, [socket]);

    return {
        isLoading,
        filteredLocalResults, 
        filteredGlobalResults 
    };
}