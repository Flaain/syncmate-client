import React from "react";

import { sessionApi } from "@/entities/session";

import { useQuery } from "@/shared/lib/hooks/useQuery";
import { ModalConfig, selectModalActions, useModal } from "@/shared/lib/providers/modal";
import { toast } from "@/shared/lib/toast";
import { Confirm } from "@/shared/ui/Confirm";

export const useActiveSessionsMenu = () => {
    const [isTerminating, setIsTerminating] = React.useState(false);

    const { data, isLoading, isError, isRefetching, refetch, setData, } = useQuery(({ signal }) => sessionApi.getSessions(signal), { prefix: 'sidebar/sessions' });

    const { onAsyncActionModal, onOpenModal, onCloseModal } = useModal(selectModalActions);

    const handleDrop = async (_id: string) => {
        await onAsyncActionModal(() => sessionApi.dropSession(_id), {
            onResolve: () => {
                setData((prevState) => ({ ...prevState, sessions: prevState.sessions.filter((s) => s._id !== _id) }))
                toast.success('Session was terminated');
            },
            onReject: () => toast.error('Failed to teriminate session'),
            closeOnSuccess: true,
            closeOnError: true
        });
    };

    const handleTerminate = async () => {
        setIsTerminating(true);

        await onAsyncActionModal(() => sessionApi.terminateAllSessions(), {
            onResolve: ({ data: { deletedCount } }) => {
                setData((prevState) => ({ ...prevState, sessions: [] }));
                toast.success(`${deletedCount} ${deletedCount > 1 ? 'sessions' : 'session'} was terminated`);
            },
            onReject: () => toast.error('Failed to teriminate session'),
            closeOnSuccess: true,
            closeOnError: true
        });

        setIsTerminating(false);
    };

    const getModalConfig = React.useCallback((_id?: string): ModalConfig => ({
        content: (
            <Confirm
                title={`Terminate ${_id ? 'Session' : 'Sessions'}`}
                description={`Are you sure you want to terminate ${_id ? 'this session' : 'all other sessions'}?`}
                onCancel={onCloseModal}
                onConfirmText='Terminate'
                onConfirmButtonIntent='destructive'
                onConfirm={() => _id ? handleDrop(_id) : handleTerminate()}
            />
        ),
        withHeader: false
    }), []);

    return {
        isTerminating,
        data,
        isLoading,
        isError,
        isRefetching,
        refetch,
        getModalConfig,
        onOpenModal
    }
}