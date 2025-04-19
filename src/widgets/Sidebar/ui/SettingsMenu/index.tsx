import { SidebarMenuContainer } from '@/shared/ui/SidebarMenuContainer';
import { SidebarMenuHeader } from '@/shared/ui/SidebarMenuHeader';
import { useSidebarMenu } from '../../lib/useSidebarMenu';
import { SidebarMenuProps } from '../../model/types';

export const SettingsMenu = (props: SidebarMenuProps) => {
    const { activeMenu, panelRef, shouldRemove, onAnimationEnd, handleBack } = useSidebarMenu<'', HTMLDivElement>(props);

    return (
        <>
            {/* active menu here */}
            <SidebarMenuContainer
                ref={panelRef}
                hasActiveMenu={!!activeMenu}
                onAnimationEnd={onAnimationEnd}
                shouldRemove={shouldRemove}
            >
                <SidebarMenuHeader onBack={handleBack} title='Settings' />
                settings
            </SidebarMenuContainer>
        </>
    );
};