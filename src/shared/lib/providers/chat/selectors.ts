import { ChatStore } from './types';

export const getUseMessageSelector = (state: ChatStore) => ({
    lastMessageRef: state.refs.lastMessageRef,
    params: state.params,
    selectedMessages: state.selectedMessages,
    isContextActionsBlocked: state.isContextActionsBlocked,
    setChat: state.actions.setChat
});

export const getUseCtxMenuMessageSelector = (state: ChatStore) => ({
    params: state.params,
    isContextActionsBlocked: state.isContextActionsBlocked
});

export const getUseSendMessageSelector = (state: ChatStore) => ({
    textareaRef: state.refs.textareaRef,
    params: state.params,
    handleOptimisticUpdate: state.actions.handleOptimisticUpdate
});

export const isContextActionsBlockedSelector = (state: ChatStore) => state.isContextActionsBlocked;
export const showDetailsSelector = (state: ChatStore) => state.showDetails;

export const messageContextMenuSelector = (state: ChatStore) => ({
    textareaRef: state.refs.textareaRef,
    handleSelectMessage: state.actions.handleSelectMessage
});

export const messagesListSelector = (state: ChatStore) => ({
    refs: state.refs,
    params: state.params,
    messages: state.messages,
    isUpdating: state.isUpdating,
    setChat: state.actions.setChat
});

export const groupedMessagesSelector = (state: ChatStore) => ({
    textareaRef: state.refs.textareaRef,
    params: state.params,
    mode: state.mode,
    handleSelectMessage: state.actions.handleSelectMessage
});

export const sendMessageSelector = (state: ChatStore) => ({
    params: state.params,
    lastMessageRef: state.refs.lastMessageRef,
    textareaRef: state.refs.textareaRef,
    showAnchor: state.showAnchor
});

export const outletHeaderSelector = (state: ChatStore) => ({ chatMode: state.mode, setChat: state.actions.setChat });

export const selectStateSelector = (state: ChatStore) => ({
    params: state.params,
    selectedMessages: state.selectedMessages,
    setChat: state.actions.setChat
});

export const setChatSelector = (state: ChatStore) => state.actions.setChat;

export const conversationProviderSelector = (state: ChatStore) => ({
    listRef: state.refs.listRef,
    bottomPlaceholderRef: state.refs.bottomPlaceholderRef,
    setChat: state.actions.setChat
});

export const messageSelector = ({ isContextActionsBlocked, mode, isUpdating }: ChatStore) => ({
    isContextActionsBlocked,
    isUpdating,
    mode
});

export const selectionCtxMenuSelector = ({
    params,
    selectedMessages,
    actions: { setChat, handleSelectMessage }
}: ChatStore) => ({
    params,
    selectedMessages,
    handleSelectMessage,
    setChat
});