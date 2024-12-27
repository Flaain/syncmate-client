import { Message } from "@/entities/Message/model/types";
import { ApiBaseResult } from "@/shared/api/API";
import { DataWithCursor } from "@/shared/model/types";

export interface MessagesListProps {
    getPreviousMessages: (id: string, cursor?: string, signal?: AbortSignal) => Promise<ApiBaseResult<DataWithCursor<Message>>>;
}