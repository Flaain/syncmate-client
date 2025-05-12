import { useShallow } from "zustand/shallow";

import { ModalConfig, selectModalActions, useModal } from "@/shared/lib/providers/modal";
import { Confirm } from "@/shared/ui/Confirm";
import { PreAnimatedSkeleton } from "@/shared/ui/PreAnimatedSkeleton";
import { SidebarMenuButton } from "@/shared/ui/SidebarMenu";
import { Typography } from "@/shared/ui/Typography";

import { useDataStorageMenu } from "../../model/useDataStorageMenu";

export const DataStorageMenuContent = () => {
    const { onOpenModal, onCloseModal } = useModal(useShallow(selectModalActions));
    const { handleClearCache, quota, usage } = useDataStorageMenu();

    const confirmConfig: ModalConfig = {
        content: (
            <Confirm
                onCancel={onCloseModal}
                onConfirm={handleClearCache}
                onConfirmText='Clear'
                text='Are you certain you wish to clear your browser cache? Doing so may result in a longer page load time.'
                onConfirmButtonVariant='destructive'
            />
        ),
        withHeader: false,
    };
    
    return (
        <div className='px-4 pt-3 flex flex-col gap-2'>
            <Typography as='h2' title='Automatic cached files' className='px-4' weight='medium' size='lg'>
                Automatic cached files
            </Typography>
            <SidebarMenuButton
                disabled={usage === 0}
                onClick={() => onOpenModal(confirmConfig)}
                title='Cache storage usage'
                description={
                    <Typography
                        as='p'
                        variant='secondary'
                        size='sm'
                        className='flex items-center gap-1 whitespace-nowrap'
                    >
                        {usage === 0 ? 'Your cache is currently clear' : (
                            <>
                                Consumed {usage ?? <PreAnimatedSkeleton className='flex w-8 h-3 rounded-full bg-primary-dark-50' />} of&nbsp;
                                {quota ?? <PreAnimatedSkeleton className='flex w-16 h-3 rounded-full bg-primary-dark-50' />}
                            </>
                    )}
                    </Typography>
                }
            />
        </div>
    );
};