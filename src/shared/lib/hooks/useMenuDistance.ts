import { MAX_POINTER_DISTANCE_DDM } from "@/shared/constants";
import { useEvents } from "@/shared/model/store";
import React from "react";

export const useMenuDistance = <T extends HTMLElement>({ ref, onClose, deps }: { ref: React.RefObject<T>; onClose: () => void; deps?: React.DependencyList }) => {
    const addEventListener = useEvents((state) => state.addEventListener);

    const handleMouseMove = React.useCallback(({ clientX, clientY }: MouseEvent) => {
        if (!ref.current) return;

        const { x, y, width, height } = ref.current.getBoundingClientRect();

        (Math.abs(clientX - (x + width / 2)) > MAX_POINTER_DISTANCE_DDM || Math.abs(clientY - (y + height / 2)) > MAX_POINTER_DISTANCE_DDM) && onClose();
    }, []);

    React.useEffect(() => {
        const removeEventListener = addEventListener('keydown', (event) => event.key === 'Escape' && onClose());

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            removeEventListener();
            
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, deps ?? []);
}