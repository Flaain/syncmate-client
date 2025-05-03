import React from "react";

import { MAX_POINTER_DISTANCE_DDM } from "../constants";
import { useEvents } from "../model/store";

interface MenuDistanceProps {
    ref: React.RefObject<HTMLDivElement | null>; 
    onClose: () => void; 
    children: React.ReactNode;    
}

export const MenuDistance = ({ children, onClose, ref }: MenuDistanceProps) => {
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
    }, []);

    return children;
};
