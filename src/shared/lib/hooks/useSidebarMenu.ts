import React from "react";

let alreadyClosing = false; // TODO: just a temp solution for prevent closing animation from flickering (happen when user spam click on back button)

export const useSidebarMenu = <T extends string | null, P extends HTMLElement>(onPrevMenu?: (shouldRemove?: boolean) => void) => {
    const [shouldRemove, setShouldRemove] = React.useState(false);
    const [activeMenu, setActiveMenu] = React.useState<T | null>(null);

    const panelRef = React.useRef<P>(null);

    const handleBack = () => {
        if (alreadyClosing) return;

        alreadyClosing = true;

        onPrevMenu?.();
        setShouldRemove(true);
    }

    const onAnimationEnd = () => {
        alreadyClosing = false;
        shouldRemove && onPrevMenu?.(true);
    }

    const changeMenu = (menu: T) => {
        setActiveMenu(menu);

        menu !== activeMenu && panelRef.current?.classList.add('-translate-x-20');
    }

    const onClose = (shouldRemove?: boolean) => shouldRemove ? setActiveMenu(null) : panelRef.current?.classList.remove('-translate-x-20');

    return {
        panelRef,
        shouldRemove,
        activeMenu,
        setActiveMenu,
        handleBack,
        changeMenu,
        onAnimationEnd,
        onClose,
    }
}