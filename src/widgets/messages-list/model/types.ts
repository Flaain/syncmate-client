import { ApiBaseResult } from '@/shared/api/API';
import { DataWithCursor, Message } from '@/shared/model/types';

export interface MessagesListProps {
    getPreviousMessages: (
        id: string,
        cursor: string,
        signal?: AbortSignal
    ) => Promise<ApiBaseResult<DataWithCursor<Array<[string, Message]>>>>;
}

export type GroupedMessages = Record<string, Array<Array<Message>>>;