import React from "react";

import { useShallow } from "zustand/shallow";

import { MESSAGE_ENDPOINTS, messageApi } from "@/entities/message";

import { selectStateSelector, useChat } from "@/shared/lib/providers/chat";
import { selectModalActions, useModal } from "@/shared/lib/providers/modal";
import { toast } from "@/shared/lib/toast";
import { addEventListenerSelector } from "@/shared/model/selectors";
import { useEvents } from "@/shared/model/store";
import { Confirm } from "@/shared/ui/Confirm";

export const useSelectState = () => {
    const { onOpenModal, onAsyncActionModal, onCloseModal } = useModal(useShallow(selectModalActions));
    const { selectedMessages, params, chatInfo, setChat } = useChat(useShallow(selectStateSelector));

    const addEventListener = useEvents(addEventListenerSelector);

    React.useEffect(() => {
        const removeListener = addEventListener('keydown', ({ key }) => {
            key === 'Escape' && setChat({ mode: 'default', selectedMessages: new Map() });
        });

        return () => removeListener();
    }, []);

    const handleConfirmDeleteMessages = async () => {
        const size = selectedMessages.size;

        await onAsyncActionModal(
            () =>
                messageApi.delete({
                    endpoint: `${MESSAGE_ENDPOINTS[params.type]}/delete/${params.id}`,
                    messageIds: [...selectedMessages.keys()]
                }),
            {
                closeOnError: true,
                onResolve: () => {
                    toast.success(`${size} ${size > 1 ? 'messages' : 'message'} was deleted`);
                    setChat({ mode: 'default', selectedMessages: new Map() });
                },
                onReject: () => toast.error('Cannot delete messages')
            }
        );
    };

    const handleDelete = () => {
        if (!selectedMessages.size) return;

        const size = selectedMessages.size;

        onOpenModal({
            content: (
                <Confirm
                    title={`Delete ${size > 1 ? `${size} messages` : 'message'}`}
                    withAvatar
                    avatarUrl={chatInfo.avatar?.url}
                    description={`Are you sure want to delete ${size > 1 ? `${size} messages` : 'this message'}?`}
                    onCancel={onCloseModal}
                    onConfirmButtonIntent='destructive'
                    onConfirmText='Delete'
                    onConfirm={handleConfirmDeleteMessages}
                />
            ),
            withHeader: false
        });
    };

    return handleDelete;
}