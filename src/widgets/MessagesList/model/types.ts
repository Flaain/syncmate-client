import { Message } from '@/entities/Message/model/types';

export interface MessagesListProps {
    messages: Array<Message>;
    getPreviousMessages: () => void;
    nextCursor: string | null;
}