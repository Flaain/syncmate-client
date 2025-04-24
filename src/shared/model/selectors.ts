import { SocketStore } from "./types";

export const socketSelector = (state: SocketStore) => state.socket;