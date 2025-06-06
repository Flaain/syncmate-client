import React from "react";

export const useSidebarMenu = <T extends string | null, P extends HTMLElement>(onPrevMenu?: (shouldRemove?: boolean) => void) => {
    const [shouldRemove, setShouldRemove] = React.useState(false);
    const [activeMenu, setActiveMenu] = React.useState<T | null>(null);

    const panelRef = React.useRef<P>(null);

    const handleBack = () => {
        onPrevMenu?.();
        setShouldRemove(true);
    }

    const onAnimationEnd = () => {
        shouldRemove && onPrevMenu?.(true);
    }

    const onClose = (shouldRemove?: boolean) => shouldRemove ? setActiveMenu(null) : panelRef.current?.classList.remove('-translate-x-20');

    return {
        panelRef,
        shouldRemove,
        activeMenu,
        setActiveMenu,
        handleBack,
        onAnimationEnd,
        onClose,
    }
}