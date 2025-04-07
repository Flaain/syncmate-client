import { ModalStore } from "./types";

export const selectModalActions = (state: ModalStore) => state.actions;
export const editNameModalSelector = (state: ModalStore) => ({ onCloseModal: state.actions.onCloseModal, isModalDisabled: state.isModalDisabled });