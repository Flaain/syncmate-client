import React from "react";

import { useEvents } from "@/shared/model/store";

const MAX_POINTER_DISTANCE_DDM = 180;

interface UseMenuDistanceProps<T extends HTMLElement> {
    /**
     * A React ref object pointing to the target HTML element. This is used
     * to calculate the menu's position relative to the element.
     */
    ref: React.RefObject<T | null>;

    /**
     * A callback function that is triggered when the menu needs to be closed.
     */
    onClose: () => void;

    /**
     * An optional flag that, when set to `true`, allows the hook to
     * exit early without performing its calculations and setting up event listener.
     * @default false
     */
    earlyReturn?: boolean;

    /**
     * The maximum distance in pixels from the center of the target element
     * to trigger the menu.
     * @default MAX_POINTER_DISTANCE_DDM
     * @see {@link MAX_POINTER_DISTANCE_DDM}
     */
    x_distance?: number;

    /**
     * The maximum distance in pixels from the center of the target element
     * to trigger the menu.
     * @default MAX_POINTER_DISTANCE_DDM
     * @see {@link MAX_POINTER_DISTANCE_DDM}
     */
    y_distance?: number;
}

export const useMenuDistance = <E extends HTMLElement>({ ref, x_distance, y_distance, onClose, earlyReturn }: UseMenuDistanceProps<E>) => {
    const addEventListener = useEvents((state) => state.addEventListener);

    const handleMouseMove = React.useCallback(({ clientX, clientY }: MouseEvent) => {
        if (!ref.current) return;

        const { x, y, width, height } = ref.current.getBoundingClientRect();

        (Math.abs(clientX - (x + width / 2)) > (x_distance ?? MAX_POINTER_DISTANCE_DDM) || Math.abs(clientY - (y + height / 2)) > (y_distance ?? MAX_POINTER_DISTANCE_DDM)) && onClose();
    }, []);

    React.useEffect(() => {
        if (earlyReturn) return;

        const removeEventListener = addEventListener('keydown', (event) => event.key === 'Escape' && onClose());

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            removeEventListener();

            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [earlyReturn]);
}