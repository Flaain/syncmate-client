import { ChatStore } from '@/shared/lib/providers/chat/types';

export const messagesListSelector = (state: ChatStore) => ({
    refs: state.refs,
    params: state.params,
    messages: state.messages,
    setChat: state.actions.setChat
});