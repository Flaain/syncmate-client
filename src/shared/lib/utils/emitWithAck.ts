import { useSession } from '@/entities/session';

import { api } from '@/shared/api';
import { useSocket } from '@/shared/model/store';
import { SOCKET_ERROR_CODE } from '@/shared/model/types';

export const emitWithAck = <T>(event: string, payload: T, _retry?: boolean) => {
    return new Promise((resolve, reject) => {
        const socket = useSocket.getState().socket;

        if (!socket) return reject('Current socket is not defined');

        socket.emit(event, payload, async (error: Record<string, any>, response: any) => {
            try {
                if (error) {
                    if (error.code === SOCKET_ERROR_CODE.TOKEN_EXPIRED) {
                        if (_retry) throw new Error('Token expired. Please re-authenticate again.');

                        const { data: { accessToken } } = await api.get<{ accessToken: string }>('/auth/refresh');

                        socket.emit('update', accessToken, (error: Record<string, any>) => {
                            try {
                                if (error) throw new Error('Cannot update token.');

                                resolve(emitWithAck(event, payload, true));
                            } catch (error) {
                                reject(error);
                                useSession.getState().actions.onSignout();
                            }
                        });
                    } else {
                        reject(error);
                    }
                } else {
                    resolve(response);
                }
            } catch (error) {
                reject(error);
                useSession.getState().actions.onSignout();
            }
        });
    });
};
