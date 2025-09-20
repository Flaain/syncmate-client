import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { createStore } from 'zustand';
import { useShallow } from 'zustand/shallow';

import { MIN_SCROLL_BOTTOM } from '@/widgets/messages-list';

import { useSession } from '@/entities/session';

import { conversationProviderSelector, useChat } from '@/shared/lib/providers/chat';
import { emitWithAck } from '@/shared/lib/utils/emitWithAck';
import { getScrollBottom } from '@/shared/lib/utils/getScrollBottom';
import { useLayout, useSocket } from '@/shared/model/store';
import { Message, PRESENCE } from '@/shared/model/types';

import { conversationActions } from './actions';
import { ConversationContext } from './context';
import { CONVERSATION_EVENTS, Conversation, ConversationStore } from './types';

export const ConversationProvider = ({ conversation, children }: { conversation: Omit<Conversation, 'messages'>; children: React.ReactNode }) => {
    const { id: recipientId } = useParams() as { id: string };
    const { setChat, listRef, bottomPlaceholderRef } = useChat(useShallow(conversationProviderSelector));
    const { 0: store } = React.useState(() => createStore<ConversationStore>((_, get) => ({ 
        conversation, 
        isRecipientTyping: false, 
        actions: conversationActions({ get }) 
    })));
    
    const socket = useSocket(useShallow((state) => state.socket));
    const userId = useSession((state) => state.userId);
    
    const navigate = useNavigate();

    React.useEffect(() => {
        document.title = `Converstaion with ${conversation.recipient.name}`;

        store.setState({ conversation });
    }, [conversation]);

    React.useEffect(() => {
        emitWithAck(CONVERSATION_EVENTS.JOIN, { recipientId })

        socket?.io.on('reconnect', () => {
            emitWithAck(CONVERSATION_EVENTS.JOIN, { recipientId })
        });

        return () => {
            emitWithAck(CONVERSATION_EVENTS.LEAVE, { recipientId })
        };
    }, [recipientId]);

    React.useEffect(() => {
        if (!socket) return;

        socket.on(CONVERSATION_EVENTS.USER_PRESENCE, ({ presence, lastSeenAt }: { presence: PRESENCE; lastSeenAt?: string }) => {
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

        socket.on(CONVERSATION_EVENTS.USER_BLOCK, (id: string) => {
            store.setState((prevState) => ({
                conversation: {
                    ...prevState.conversation,
                    [id === userId ? 'isInitiatorBlocked' : 'isRecipientBlocked']: true
                }
            }));

            setChat({ isContextActionsBlocked: true });
        });

        socket.on(CONVERSATION_EVENTS.USER_UNBLOCK, (id: string) => {
            store.setState((prevState) => {
                const isInitiatorBlocked = id === userId ? false : prevState.conversation.isInitiatorBlocked;
                const isRecipientBlocked = id === prevState.conversation.recipient._id ? false : prevState.conversation.isRecipientBlocked;

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

        socket.on(CONVERSATION_EVENTS.MESSAGE_READ, ({ _id, readedAt }: { _id: string; readedAt: string }) => {
            setChat(({ messages }) => {
                const newMessages = new Map(messages.data), msg = newMessages.get(_id);

                msg && newMessages.set(_id, {
                    ...msg,
                    readedAt,
                    [msg.sender._id === userId ? 'hasBeenRead' : 'alreadyRead']: true
                });

                return { messages: { ...messages, data: newMessages } };
            });
        })

        socket.on(CONVERSATION_EVENTS.MESSAGE_SEND, (message: Message) => {
            setChat(({ messages }) => {
                const newMessages = new Map(messages.data);

                newMessages.set(message._id, message);

                return { messages: { ...messages, data: newMessages } };
            });
            
            if (!(message.sender._id === userId)) {
                const isAboveBottomMin = !!(listRef.current && getScrollBottom(listRef.current) > MIN_SCROLL_BOTTOM);
                
                document.visibilityState === 'hidden' || isAboveBottomMin && useLayout.getState().actions.playSound('new_message');

                !isAboveBottomMin && bottomPlaceholderRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
        });

        socket.on(CONVERSATION_EVENTS.MESSAGE_EDIT, ({ _id, text, updatedAt }: Pick<Message, '_id' | 'text' | 'updatedAt'>) => {
            setChat(({ messages }) => {
                const newMessages = new Map(messages.data), editedMsg = newMessages.get(_id);

                editedMsg && newMessages.set(_id, { ...editedMsg, text, updatedAt, hasBeenEdited: true });

                newMessages.forEach((v, k) => v.replyTo?._id === _id && newMessages.set(k, { ...v, replyTo: { ...v.replyTo, text } }));

                return { messages: { ...messages, data: newMessages } };
            });
        });

        socket.on(CONVERSATION_EVENTS.MESSAGE_DELETE, (messageIds: Array<string>) => {
            setChat(({ messages }) => {
                const newMessages = new Map(messages.data);
                
                messageIds.forEach((id) => newMessages.delete(id));
                
                return { messages: { ...messages, data: newMessages } };
            });
        });

        socket.on(CONVERSATION_EVENTS.CREATED, (_id: string) => store.setState((prevState) => ({ conversation: { ...prevState.conversation, _id } })));
        socket.on(CONVERSATION_EVENTS.DELETED, () => navigate('/'));
        socket.on(CONVERSATION_EVENTS.TYPING_START, (id: string) => store.setState({ isRecipientTyping: id === recipientId }));
        socket.on(CONVERSATION_EVENTS.TYPING_STOP, () => store.setState({ isRecipientTyping: false }));
        
        return () => {
            setChat({ mode: 'default', selectedMessages: new Map(), showAnchor: false });

            socket.off(CONVERSATION_EVENTS.USER_PRESENCE);
            socket.off(CONVERSATION_EVENTS.USER_BLOCK);
            socket.off(CONVERSATION_EVENTS.USER_UNBLOCK);

            socket.off(CONVERSATION_EVENTS.MESSAGE_SEND);
            socket.off(CONVERSATION_EVENTS.MESSAGE_EDIT);
            socket.off(CONVERSATION_EVENTS.MESSAGE_DELETE);

            socket.off(CONVERSATION_EVENTS.CREATED);
            socket.off(CONVERSATION_EVENTS.DELETED);

            socket.off(CONVERSATION_EVENTS.TYPING_START);
            socket.off(CONVERSATION_EVENTS.TYPING_STOP);
        };
    }, []);

    return (
        <ConversationContext.Provider value={store}>
            {children}
        </ConversationContext.Provider>
    );
};