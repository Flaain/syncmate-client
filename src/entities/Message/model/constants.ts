import { ChatParams } from '@/shared/lib/providers/chat/types';

export const endpoints: Record<ChatParams['type'], string> = {
    conversation: 'message',
    group: 'group-message'
};