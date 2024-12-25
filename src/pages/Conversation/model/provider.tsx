import React from 'react';
import { CONVERSATION_EVENTS, ConversationStore } from './types';
import { useNavigate, useParams } from 'react-router-dom';
import { ConversationContext } from './context';
import { Message } from '@/entities/Message/model/types';
import { useLayout, useSocket } from '@/shared/model/store';
import { useSession } from '@/entities/session';
import { createStore } from 'zustand';
import { conversationActions } from './actions';
import { useChat } from '@/shared/lib/providers/chat/context';
import { PRESENCE } from '@/entities/profile/model/types';
import { useShallow } from 'zustand/shallow';

const initialState: Omit<ConversationStore, 'actions'> = {
    conversation: null!,
    error: null,
    isRecipientTyping: false,
    status: 'loading',
    isRefetching: false
};

export const ConversationProvider = ({ children }: { children: React.ReactNode }) => {
    const { setChat, getChat } = useChat(useShallow((state) => ({ setChat: state.actions.setChat, getChat: state.actions.getChat })));

    const { id: recipientId } = useParams() as { id: string };
    const { 0: store } = React.useState(() => createStore<ConversationStore>((set, get) => ({ 
        ...initialState, 
        actions: conversationActions({ set, get, setChat, getChat }) 
    })));
    
    const socket = useSocket((state) => state.socket);
    const userId = useSession((state) => state.userId);

    const navigate = useNavigate();

    React.useEffect(() => {
        const abortController = new AbortController();

        store.getState().actions.getConversation({ action: 'init', recipientId, abortController });

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
            console.log(_id, readedAt)
            setChat((prevState) => ({ messages: prevState.messages.map((message) => message._id === _id ? { ...message, readedAt, hasBeenRead: true } : message ) }))
        })

        socket?.on(CONVERSATION_EVENTS.MESSAGE_SEND, (message: Message) => {
            setChat((prevState) => ({ messages: [...prevState.messages, message]}))
        });

        socket?.on(CONVERSATION_EVENTS.MESSAGE_EDIT, (editedMessage: Message) => {
            setChat((prevState) => ({
                messages: prevState.messages.map((message) => {
                    if (message._id === editedMessage._id) return editedMessage;
                    if (message.inReply && message.replyTo?._id === editedMessage._id) return { ...message, replyTo: { ...message.replyTo, text: editedMessage.text } };

                    return message;
                })
            }))
        });

        socket?.on(CONVERSATION_EVENTS.MESSAGE_DELETE, (messageIds: Array<string>) => {
            setChat((prevState) => {
                const array = prevState.messages.reduce((acc, message) => {
                    if (messageIds.includes(message._id)) {
                        useLayout.setState((prevState) => {
                            if (prevState.drafts.get(recipientId)?.selectedMessage?._id === message._id) {
                                const newDrafts = new Map([...prevState.drafts]);
                                
                                newDrafts.delete(recipientId);

                                return { drafts: newDrafts };
                            }

                            return prevState;
                        })

                        return acc;
                    };

                    if (message.inReply && messageIds.includes(message.replyTo!._id)) return [...acc, { ...message, replyTo: undefined }];

                    return [...acc, message];
                }, [] as Array<Message>);

                return { messages: array };
            });
        });

        socket?.on(CONVERSATION_EVENTS.CREATED, (_id: string) => {
            store.setState((prevState) => ({ conversation: { ...prevState.conversation, _id } }));
        });

        socket?.on(CONVERSATION_EVENTS.DELETED, () => navigate('/'));
        socket?.on(CONVERSATION_EVENTS.START_TYPING, (id: string) => store.setState({ isRecipientTyping: id === recipientId }));
        socket?.on(CONVERSATION_EVENTS.STOP_TYPING, () => store.setState({ isRecipientTyping: false }));
        return () => {
            setChat({ mode: 'default', selectedMessages: new Map(), showAnchor: false });

            abortController.abort('Signal aborted due to new incoming request');

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
    }, [recipientId]);

    return (
        <ConversationContext.Provider value={store}>
            {children}
        </ConversationContext.Provider>
    );
};