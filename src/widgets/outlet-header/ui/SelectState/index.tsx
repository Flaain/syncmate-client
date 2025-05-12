import React from "react";

import { useShallow } from "zustand/shallow";

import { messageApi, endpoints } from "@/entities/message";

import CloseIcon from '@/shared/lib/assets/icons/close.svg?react';
import DeleteIcon from '@/shared/lib/assets/icons/delete.svg?react';

import { selectStateSelector, useChat } from "@/shared/lib/providers/chat";
import { selectModalActions, useModal } from "@/shared/lib/providers/modal";
import { toast } from "@/shared/lib/toast";
import { useEvents } from "@/shared/model/store";
import { Button } from "@/shared/ui/button";
import { Confirm } from "@/shared/ui/Confirm";
import { Typography } from "@/shared/ui/Typography";


export const SelectState = () => {
    const { onOpenModal, onAsyncActionModal, onCloseModal } = useModal(useShallow(selectModalActions));
    const { selectedMessages, params, setChat } = useChat(useShallow(selectStateSelector));

    const addEventListener = useEvents((state) => state.addEventListener);

    React.useEffect(() => {
        const removeListener = addEventListener('keydown', ({ key }) => {
            key === 'Escape' && setChat({ mode: 'default', selectedMessages: new Map() })
        });

        return () => removeListener();
    }, []);

    const handleDelete = () => {
        const size = selectedMessages.size;

        onOpenModal({
            content: (
                <Confirm
                    text={`Are you sure want to delete ${size > 1 ? `${size} messages` : 'this message'}?`}
                    onCancel={onCloseModal}
                    onConfirmButtonVariant='destructive'
                    onConfirmText='Delete'
                    onConfirm={() => onAsyncActionModal(() => messageApi.delete({
                        endpoint: `${endpoints[params.type]}/delete/${params.id}`,
                        messageIds: [...selectedMessages.keys()]
                    }),
                    {
                        closeOnError: true,
                        onResolve: () => {
                            toast.success(`${size} ${size > 1 ? 'messages' : 'message'} was deleted`);
                            setChat({ mode: 'default', selectedMessages: new Map() })
                        },
                        onReject: () => toast.error('Cannot delete messages')
                    })}
                />
            ),
            withHeader: false,
        })
    }

    return (
        <div className='flex items-center size-full animate-in slide-in-from-top-5 duration-200'>
            <Button variant='ghost' size='icon' className="size-10 p-0 rounded-full mr-2 mt-[1px]" onClick={() => setChat({ mode: 'default', selectedMessages: new Map() })}>
                <CloseIcon className='size-6 text-primary-gray' />
            </Button>
            <Typography>{`${selectedMessages.size} ${selectedMessages.size > 1 ? 'messages' : 'message'}`}</Typography>
            <Button
                onClick={handleDelete}
                variant='ghost'
                className='dark:text-red-500 dark:hover:bg-red-500/20 gap-2 ml-auto'
            >
                <DeleteIcon className='size-6 text-red-500' />
                Delete
            </Button>
        </div>
    );
};
