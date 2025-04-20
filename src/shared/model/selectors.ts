import { SocketStore } from "./store";

export const socketSelector = (state: SocketStore) => state.socket;