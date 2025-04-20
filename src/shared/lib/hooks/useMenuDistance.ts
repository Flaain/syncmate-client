import { MAX_POINTER_DISTANCE_DDM } from "@/shared/constants";
import { useEvents } from "@/shared/model/store";
import React from "react";

interface UseMenuDistanceProps<T extends HTMLElement> {
    ref: React.RefObject<T | null>; 
    earlyReturn?: boolean; 
    onClose: () => void; 
    deps?: React.DependencyList;
}

export const useMenuDistance = <T extends HTMLElement>({ ref, onClose, deps, earlyReturn }: UseMenuDistanceProps<T>) => {
    const addEventListener = useEvents((state) => state.addEventListener);

    const handleMouseMove = React.useCallback(({ clientX, clientY }: MouseEvent) => {
        if (!ref.current) return;

        const { x, y, width, height } = ref.current.getBoundingClientRect();

        (Math.abs(clientX - (x + width / 2)) > MAX_POINTER_DISTANCE_DDM || Math.abs(clientY - (y + height / 2)) > MAX_POINTER_DISTANCE_DDM) && onClose();
    }, []);

    React.useEffect(() => {
        if (earlyReturn) return;

        const removeEventListener = addEventListener('keydown', (event) => event.key === 'Escape' && onClose());

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            removeEventListener();
            
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, deps ?? []);
}