import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { createStore } from 'zustand';
import { useShallow } from 'zustand/shallow';

import { IMessage } from '@/entities/message';
import { useSession } from '@/entities/session';

import { DEFAULT_TITLE } from '@/shared/constants';
import { setChatSelector, useChat } from '@/shared/lib/providers/chat';
import { useLayout, useSocket } from '@/shared/model/store';
import { PRESENCE } from '@/shared/model/types';

import { conversationActions } from './actions';
import { ConversationContext } from './context';
import { CONVERSATION_EVENTS, Conversation, ConversationStore } from './types';

export const ConversationProvider = ({ conversation, children }: { conversation: Omit<Conversation, 'messages'>; children: React.ReactNode }) => {
    const { id: recipientId } = useParams() as { id: string };
    const { 0: store } = React.useState(() => createStore<ConversationStore>((_, get) => ({ 
        conversation, 
        isRecipientTyping: false, 
        actions: conversationActions({ get }) 
    })));
    
    const socket = useSocket(useShallow((state) => state.socket));
    const userId = useSession((state) => state.userId);
    
    const setChat = useChat(useShallow(setChatSelector));
    const navigate = useNavigate();

    React.useEffect(() => {
        document.title = `Converstaion with ${conversation.recipient.name}`;

        store.setState({ conversation });

        socket?.emit(CONVERSATION_EVENTS.JOIN, { recipientId });

        socket?.io.on('reconnect', () => socket?.emit(CONVERSATION_EVENTS.JOIN, { recipientId }));

        socket?.on(CONVERSATION_EVENTS.USER_PRESENCE, ({ presence, lastSeenAt }: { presence: PRESENCE; lastSeenAt?: string }) => {
            store.setState((prevState) => ({
                conversation: {
                    ...prevState.conversation,
                    recipient: {
                        ...prevState.conversation.recipient,
                        lastSeenAt: lastSeenAt || prevState.conversation.recipient.lastSeenAt,
                        presence
                    }
                }
            }));
        });

        socket?.on(CONVERSATION_EVENTS.USER_BLOCK, (id: string) => {
            store.setState((prevState) => ({
                conversation: {
                    ...prevState.conversation,
                    [id === userId ? 'isInitiatorBlocked' : 'isRecipientBlocked']: true
                }
            }));

            setChat({ isContextActionsBlocked: true });
        });

        socket?.on(CONVERSATION_EVENTS.USER_UNBLOCK, (id: string) => {
            store.setState((prevState) => {
                const isInitiatorBlocked = id === userId ? false : prevState.conversation.isInitiatorBlocked;
                const isRecipientBlocked = id === recipientId ? false : prevState.conversation.isRecipientBlocked;

                setChat({ isContextActionsBlocked: isInitiatorBlocked || isRecipientBlocked });

                return {
                    conversation: {
                        ...prevState.conversation,
                        isInitiatorBlocked,
                        isRecipientBlocked
                    }
                }
            });
        });

        socket?.on(CONVERSATION_EVENTS.MESSAGE_READ, ({ _id, readedAt }: { _id: string; readedAt: string }) => {
            setChat(({ messages }) => ({
                messages: {
                    ...messages,
                    data: messages.data.map((message) =>
                        message._id === _id
                            ? {
                                  ...message,
                                  readedAt,
                                  [message.sender._id === userId ? 'hasBeenRead' : 'alreadyRead']: true
                              }
                            : message
                    )
                }
            }));
        })

        socket?.on(CONVERSATION_EVENTS.MESSAGE_SEND, (message: IMessage) => {
            setChat(({ messages }) => ({ messages: { ...messages, data: [...messages.data, message] } }));

            message.sender._id !== userId && document.visibilityState === 'hidden' && useLayout.getState().actions.playSound('new_message');
        });

        socket?.on(CONVERSATION_EVENTS.MESSAGE_EDIT, ({ _id, text, updatedAt }: Pick<IMessage, '_id' | 'text' | 'updatedAt'>) => {
            setChat(({ messages }) => ({
                messages: {
                    ...messages,
                    data: messages.data.map((message) => {
                        if (message._id === _id) return { ...message, text, updatedAt, hasBeenEdited: true };
                        if (message.replyTo?._id === _id) return { ...message, replyTo: { ...message.replyTo, text } };

                        return message;
                    })
                }
            }));
        });

        socket?.on(CONVERSATION_EVENTS.MESSAGE_DELETE, (messageIds: Array<string>) => {
            setChat(({ messages }) => {
                const array = messages.data.reduce((acc, message) => {
                    if (messageIds.includes(message._id)) {
                        useLayout.getState().drafts.get(recipientId)?.selectedMessage?._id === message._id && useLayout.setState(({ drafts }) => {
                            const newDrafts = new Map([...drafts]);

                            newDrafts.delete(recipientId);

                            return { drafts: newDrafts };
                        });

                        return acc;
                    };

                    return [...acc, message.inReply && messageIds.includes(message.replyTo?._id!) ? { ...message, replyTo: undefined } : message];
                }, [] as Array<IMessage>);

                return { messages: { ...messages, data: array } };
            });
        });

        socket?.on(CONVERSATION_EVENTS.CREATED, (_id: string) => {
            store.setState((prevState) => ({ conversation: { ...prevState.conversation, _id } }));
        });

        socket?.on(CONVERSATION_EVENTS.DELETED, () => navigate('/'));
        socket?.on(CONVERSATION_EVENTS.START_TYPING, (id: string) => store.setState({ isRecipientTyping: id === recipientId }));
        socket?.on(CONVERSATION_EVENTS.STOP_TYPING, () => store.setState({ isRecipientTyping: false }));
        
        return () => {
            document.title = DEFAULT_TITLE;

            setChat({ mode: 'default', selectedMessages: new Map(), showAnchor: false });

            socket?.emit(CONVERSATION_EVENTS.LEAVE, { recipientId });

            socket?.off(CONVERSATION_EVENTS.USER_PRESENCE);
            socket?.off(CONVERSATION_EVENTS.USER_BLOCK);
            socket?.off(CONVERSATION_EVENTS.USER_UNBLOCK);

            socket?.off(CONVERSATION_EVENTS.MESSAGE_SEND);
            socket?.off(CONVERSATION_EVENTS.MESSAGE_EDIT);
            socket?.off(CONVERSATION_EVENTS.MESSAGE_DELETE);

            socket?.off(CONVERSATION_EVENTS.CREATED);
            socket?.off(CONVERSATION_EVENTS.DELETED);

            socket?.off(CONVERSATION_EVENTS.START_TYPING);
            socket?.off(CONVERSATION_EVENTS.STOP_TYPING);
        };
    }, [recipientId, conversation]);

    return (
        <ConversationContext.Provider value={store}>
            {children}
        </ConversationContext.Provider>
    );
};