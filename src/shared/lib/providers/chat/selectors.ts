import { ChatStore } from './types';

export const messageSelector = (state: ChatStore) => ({
    lastMessageRef: state.refs.lastMessageRef,
    params: state.params,
    selectedMessages: state.selectedMessages,
    isContextActionsBlocked: state.isContextActionsBlocked,
    setChat: state.actions.setChat
});