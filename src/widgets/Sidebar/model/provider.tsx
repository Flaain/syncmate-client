import React from 'react';
import { createStore } from 'zustand';
import { FeedUnreadCounterEvent, FeedUpdateParams, LocalFeed, SidebarStore } from './types';
import { sidebarActions } from './actions';
import { useSocket } from '@/shared/model/store';
import { getSortedFeedByLastMessage } from '@/shared/lib/utils/getSortedFeedByLastMessage';
import { FEED_EVENTS, FeedTypes } from '@/widgets/Feed/types';
import { PRESENCE } from '@/entities/profile/model/types';
import { TypingParticipant } from '@/shared/ui/Typography';
import { SidebarContext } from './context';

const initialState: Omit<SidebarStore, 'actions'> = {
    localResults: { feed: [], nextCursor: null },
    searchRef: React.createRef(),
    localResultsError: null,
    globalResults: null,
    isSearching: false,
    searchValue: ''
};

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
    const { 0: store } = React.useState(() => createStore<SidebarStore>((set, get) => ({ ...initialState, actions: sidebarActions(set, get) })));
    
    const socket = useSocket((state) => state.socket);

    React.useEffect(() => {
        store.getState().actions.getFeed();
    }, [])

    React.useEffect(() => {
        socket?.on(FEED_EVENTS.CREATE, (createFeedItem: LocalFeed) => {
            store.setState((prevState) => {
                const index = prevState.localResults.feed.findIndex((feedItem) => feedItem._id === createFeedItem._id);

                if (index !== -1) {
                    const feed = [...prevState.localResults.feed];
                    
                    feed[index] = {
                        ...feed[index],
                        lastActionAt: createFeedItem.lastActionAt,
                        item: { ...feed[index].item, ...createFeedItem.item }
                    } as any;
                    
                    return { localResults: { ...prevState.localResults, feed: feed.sort(getSortedFeedByLastMessage) } };
                }

                return { localResults: { ...prevState.localResults, feed: [createFeedItem, ...prevState.localResults.feed] } };
            })
        });

        socket?.on(FEED_EVENTS.USER_PRESENCE, ({ recipientId, presence }: { recipientId: string; presence: PRESENCE }) => {
            store.setState((prevState) => ({
                localResults: {
                    ...prevState.localResults,
                    feed: prevState.localResults.feed.map((feedItem) => {
                        if (feedItem.type === FeedTypes.CONVERSATION && feedItem.item.recipient._id === recipientId) {
                            return { ...feedItem, item: { ...feedItem.item, recipient: { ...feedItem.item.recipient, presence } } };
                        }

                        return feedItem;
                    })
                }
            }));
        });

        socket?.on(FEED_EVENTS.UPDATE, ({ itemId, lastActionAt, lastMessage, shouldSort }: FeedUpdateParams) => {
            store.setState((prevState) => { 
                const updatedFeed = prevState.localResults.feed.map((feedItem: any) => {
                    if (feedItem.item._id === itemId) {
                        return {
                            ...feedItem,
                            lastActionAt: lastActionAt ?? feedItem.lastActionAt,
                            item: { ...feedItem.item, lastMessage: { ...feedItem.item.lastMessage, ...lastMessage } }
                        };
                    }

                    return feedItem;
                });
    
                return {
                    localResults: {
                        ...prevState.localResults,
                        feed: shouldSort ? updatedFeed.sort(getSortedFeedByLastMessage) : updatedFeed
                    }
                };
            })
        });

        socket?.on(FEED_EVENTS.UNREAD_COUNTER, ({ itemId, count, action, ctx }: FeedUnreadCounterEvent) => {
            store.setState((prevState) => {
                const actions: Record<typeof action, (unreadMessages?: number) => number> = {
                    set: () => count ?? 0,
                    dec: (unread) => Math.max((unread ?? 0) - (count ?? 1), 0)
                };

                const source: Record<typeof ctx, (feedItem: any) => any> = {
                    conversation: (feedItem: any) => {
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
                    },
                    group: () => {}
                };

                return {
                    localResults: { ...prevState.localResults, feed: prevState.localResults.feed.map(source[ctx]) }
                };
            });
        });

        socket?.on(FEED_EVENTS.DELETE, (id: string) => {
            store.setState((prevState) => ({
                localResults: {
                    ...prevState.localResults,
                    feed: prevState.localResults.feed.filter((item) => item._id !== id).sort(getSortedFeedByLastMessage)
                }
            }));
        })

        socket?.on(FEED_EVENTS.START_TYPING, (data: { _id: string; participant: TypingParticipant }) => {
            store.setState((prevState) => ({
                localResults: {
                    ...prevState.localResults,
                    feed: prevState.localResults.feed.map((feedItem: any) => {
                        if (feedItem.type !== FeedTypes.ADS && feedItem.item._id === data._id) {
                            return {
                                ...feedItem,
                                item: {
                                    ...feedItem.item,
                                    participantsTyping: [...(feedItem.item.participantsTyping ?? []), data.participant]
                                }
                            };
                        }
        
                        return feedItem;
                    })
                }
            }))
        })

        socket?.on(FEED_EVENTS.STOP_TYPING, (data: { _id: string; participant: Omit<TypingParticipant, 'name'> }) => {
            store.setState((prevState) => ({
                localResults: {
                    ...prevState.localResults,
                    feed: prevState.localResults.feed.map((feedItem: any) => {
                        if (feedItem.type !== FeedTypes.ADS && feedItem.item._id === data._id) {
                            return {
                                ...feedItem,
                                item: {
                                    ...feedItem.item,
                                    participantsTyping: feedItem.item.participantsTyping?.filter((participant: any) => participant._id !== data.participant._id)
                                } 
                            }
                        }
        
                        return feedItem;
                    })
                }
            }))
        })

        return () => {
            socket?.off(FEED_EVENTS.CREATE);
            socket?.off(FEED_EVENTS.UPDATE);
            socket?.off(FEED_EVENTS.DELETE);
            
            socket?.off(FEED_EVENTS.START_TYPING);
            socket?.off(FEED_EVENTS.STOP_TYPING);

            socket?.off(FEED_EVENTS.USER_PRESENCE);
        };
    }, [socket]);

    return <SidebarContext.Provider value={store}>{children}</SidebarContext.Provider>;
};