import { create } from 'zustand';
import { AsyncActionOptions, ModalConfig, ModalStore } from './types';
import { uuidv4 } from '../../utils/uuidv4';

export const useModal = create<ModalStore>((set, get) => ({
    modals: [],
    isModalDisabled: false,
    actions: {
        onOpenModal: (config: ModalConfig) => {
            if (config.id && get().modals.find((modal) => modal.id === config.id)) return;

            set((prevState) => ({ modals: [...prevState.modals, { id: uuidv4(), ...config }] }));
        },
        onCloseModal: (modal?: ModalConfig) => () => { // 05.03.2025 i do not fucking rememeber why i do this way
            modal?.closeHandler?.(modal);
            set((prevState) => ({ modals: prevState.modals.slice(0, -1) }));
        },
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
                closeOnSuccess && get().actions.onCloseModal()();
            } catch (error) {
                onReject?.(error);
                closeOnError && get().actions.onCloseModal()();
            } finally {
                set({ isModalDisabled: false });
            }
        }
    }
}));

export const selectModalActions = (state: ModalStore) => state.actions;