import React from "react";
import { SidebarMenuProps } from "../model/types";

export const useSidebarMenu = <T extends string, P extends HTMLElement>({ onBackCallback, backToParent }: Partial<SidebarMenuProps> = {}) => {
    const [shouldRemove, setShouldRemove] = React.useState(false);
    const [activeMenu, setActiveMenu] = React.useState<T | null>(null);

    const panelRef = React.useRef<P>(null);

    const changeMenu = React.useCallback((m: typeof activeMenu) => {
        setActiveMenu(m);
    }, []);

    const handleBack = React.useCallback(() => {
        onBackCallback?.();
        setShouldRemove(true);
    }, []);

    const onAnimationEnd = React.useCallback(() => {
        shouldRemove && backToParent?.(null);
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