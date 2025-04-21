import React from "react";

import { SidebarMenuProps } from "@/shared/model/types";

export const useSidebarMenu = <T extends string, P extends HTMLElement>({ onClose, backToParent }: Partial<SidebarMenuProps> = {}) => {
    const [shouldRemove, setShouldRemove] = React.useState(false);
    const [activeMenu, setActiveMenu] = React.useState<T | null>(null);

    const panelRef = React.useRef<P>(null);

    const changeMenu = React.useCallback((m: typeof activeMenu) => {
        setActiveMenu(m);
    }, []);

    const handleBack = React.useCallback(() => {
        onClose?.();
        setShouldRemove(true);
    }, []);

    const onAnimationEnd = React.useCallback(() => {
        shouldRemove && backToParent?.();
    }, [shouldRemove]);

    return {
        panelRef,
        shouldRemove,
        activeMenu,
        changeMenu,
        handleBack,
        onAnimationEnd,
    }
}