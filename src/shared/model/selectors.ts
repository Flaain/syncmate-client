import { EventsStore, SocketStore } from './types';

export const socketSelector = (state: SocketStore) => state.socket;
export const addEventListenerSelector = (state: EventsStore) => state.addEventListener;