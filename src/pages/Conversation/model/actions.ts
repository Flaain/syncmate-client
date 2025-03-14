import { CONVERSATION_EVENTS, ConversationStore } from './types';
import { useSocket } from '@/shared/model/store';
import { ActionsProvider } from '@/shared/model/types';
import { MessageFormState } from '@/features/SendMessage/model/types';

export const conversationActions = ({ get }: Pick<ActionsProvider<ConversationStore>, 'get'>): ConversationStore['actions'] => ({
    handleTypingStatus: () => {
        const ctx: { isTyping: boolean; typingTimeout: ReturnType<typeof setTimeout> | null } = { isTyping: false, typingTimeout: null };

        return (action: MessageFormState, reset?: boolean) => {
            if (action === 'edit') return;
            
            const { conversation: { _id, recipient } } = get(), { socket } = useSocket.getState();
            const typingData = { conversationId: _id, recipientId: recipient._id };
            
            if (reset) {
                ctx.isTyping = false;
                socket?.emit(CONVERSATION_EVENTS.STOP_TYPING, typingData);
                clearTimeout(ctx.typingTimeout!);
                return;
            }

            !ctx.isTyping ? ((ctx.isTyping = true), socket?.emit(CONVERSATION_EVENTS.START_TYPING, typingData)) : clearTimeout(ctx.typingTimeout!);

            ctx.typingTimeout = setTimeout(() => {
                ctx.isTyping = false;
                socket?.emit(CONVERSATION_EVENTS.STOP_TYPING, typingData);
            }, 5000);
        };
    },
});