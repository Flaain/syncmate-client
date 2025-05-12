import { ActionsProvider, LayoutStore } from "./types";

export const layoutActions = ({ get }: Pick<ActionsProvider<LayoutStore>, 'get'>): LayoutStore['actions'] => ({
    playSound: (name, cb?: (sound: HTMLAudioElement) => void) => {
        try {
            const sound = get().sounds[name];

            if (!sound) throw new Error('Sound not found');

            sound.currentTime = 0;
            sound.play();

            cb?.(sound);
        } catch (error) {
            console.error(error);
        }
    }
})