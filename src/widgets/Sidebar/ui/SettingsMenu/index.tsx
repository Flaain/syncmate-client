import { SidebarMenu } from '@/shared/ui/SidebarMenu';
import { useSidebarMenu } from '../../lib/useSidebarMenu';
import { SidebarMenuProps } from '../../model/types';

export const SettingsMenu = (props: SidebarMenuProps) => {
    const { activeMenu, panelRef, shouldRemove, onAnimationEnd, handleBack } = useSidebarMenu<'', HTMLDivElement>(props);

    return (
        <>
            {/* active menu here */}
            <SidebarMenu.Container
                ref={panelRef}
                hasActiveMenu={!!activeMenu}
                onAnimationEnd={onAnimationEnd}
                shouldRemove={shouldRemove}
            >
                <SidebarMenu.Header onBack={handleBack} title='Settings' />
                settings
            </SidebarMenu.Container>
        </>
    );
};