import { create } from 'zustand';

import { uuidv4 } from '../../utils/uuidv4';

import { AsyncActionOptions, ModalConfig, ModalStore } from './types';

export const useModal = create<ModalStore>((set, get) => ({
    modals: [],
    isModalDisabled: false,
    actions: {
        onOpenModal: (config: ModalConfig) => {
            if (config.id && get().modals.find((modal) => modal.id === config.id)) return;

            set((prevState) => ({ modals: [...prevState.modals, { id: uuidv4(), ...config }] }));
        },
        onCloseModal: () => {
            const { modals } = get();

            const modal = modals[modals.length - 1];

            modal.closeHandler?.(modal);

            modal._shouldRemove = true;

            set({ modals });
        },
        onRemoveModal: () => set((prevState) => ({ modals: prevState.modals.slice(0, -1) })),
        onAsyncActionModal: async <T>(
            cb: () => Promise<T>,
            {
                closeOnError = false,
                closeOnSuccess = true,
                disableOnPending = true,
                onResolve,
                onReject
            }: AsyncActionOptions<T> = {}
        ) => {
            try {
                set({ isModalDisabled: disableOnPending });

                const data = await cb();

                onResolve?.(data);
                closeOnSuccess && get().actions.onCloseModal();
            } catch (error) {
                onReject?.(error);
                closeOnError && get().actions.onCloseModal();
            } finally {
                set({ isModalDisabled: false });
            }
        }
    }
}));