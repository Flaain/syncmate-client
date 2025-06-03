import React from 'react';

import { useShallow } from 'zustand/shallow';

import CloseIcon from '@/shared/lib/assets/icons/close.svg?react';
import EditIcon from '@/shared/lib/assets/icons/edit.svg?react';
import EmailIcon from '@/shared/lib/assets/icons/email.svg?react';
import InfoIcon from '@/shared/lib/assets/icons/info.svg?react';
import LinkIcon from '@/shared/lib/assets/icons/link.svg?react';
import MentionIcon from '@/shared/lib/assets/icons/mention.svg?react';

import { useSidebarMenu } from '@/shared/lib/hooks/useSidebarMenu';
import { useChat } from '@/shared/lib/providers/chat';
import { toast } from '@/shared/lib/toast';
import { capitalizeFirstLetter } from '@/shared/lib/utils/capitalizeFirstLetter';
import { cn } from '@/shared/lib/utils/cn';
import { addEventListenerSelector } from '@/shared/model/selectors';
import { useEvents } from '@/shared/model/store';
import { OutletDetailsButtonType } from '@/shared/model/types';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Button } from '@/shared/ui/button';
import { Image } from '@/shared/ui/Image';
import { SidebarMenuSeparator } from '@/shared/ui/SidebarMenu';
import { Typography } from '@/shared/ui/Typography';

import { DETAILS_TABS, OutletDetailsMenus, OutletDetailsProps } from '../model/types';

import { EditContact } from './EditContact';

const tabsMap: Record<DETAILS_TABS, React.ReactNode> = {
    members: <div>members</div>,
    media: <div>media</div>,
    files: <div>files</div>,
    music: <div>music</div>,
    voice: <div>voice</div>
};

const iconMap: Record<OutletDetailsButtonType, React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string; titleId?: string; desc?: string; descId?: string }>> = {
    email: EmailIcon,
    link: LinkIcon,
    bio: InfoIcon,
    login: MentionIcon
}

export const OutletDetails = ({ avatarUrl, title, tabs, name, description, info }: OutletDetailsProps) => {
    const [activeTab, setActiveTab] = React.useState(0);

    const addEventListener = useEvents(addEventListenerSelector);

    const { panelRef, setActiveMenu, onClose, activeMenu } = useSidebarMenu<OutletDetailsMenus, HTMLDivElement>();
    const { setChat, showDetails } = useChat(useShallow((state) => ({
        setChat: state.actions.setChat,
        showDetails: state.showDetails
    })));

    const menus: Record<OutletDetailsMenus, React.ReactNode> = {
        editContact: <EditContact onPrevMenu={onClose} />
    }

    const onCopyToClipboard = (type: OutletDetailsButtonType, data: string) => {
        navigator.clipboard.writeText(data);
        toast.success(`${capitalizeFirstLetter(type)} copied to clipboard`);
    };

    React.useEffect(() => {
        if (!showDetails) return;

        const removeEventListener = addEventListener('keydown', (event) => {
            event.stopImmediatePropagation();

            event.key === 'Escape' && setChat({ showDetails: false });
        });

        return () => {
            removeEventListener();
        };
    }, [showDetails]);

    return (
        <div
            className={cn(
                'grid grid-cols-1 transition-all overflow-hidden ease-in-out duration-300 max-xl:absolute max-xl:top-0 max-xl:right-0 z-[999] dark:bg-primary-dark h-full max-w-[390px] w-full xl:border-l xl:border-primary-dark-200',
                !showDetails && '-mr-[390px]' // TODO: think how to we can rewrite from margin to transform to avoid reflow
            )}
        >
            <div
                ref={panelRef}
                className={cn(
                    'flex flex-col col-start-1 row-start-1 duration-300 overflow-hidden z-0',
                    activeMenu && '-translate-x-20'
                )}
            >
                <div className='flex items-center gap-5 min-h-14 px-3'>
                    <Button
                        ripple
                        onClick={() => setChat({ showDetails: false })}
                        size='icon'
                        variant='ghost'
                        intent='secondary'
                    >
                        <CloseIcon />
                    </Button>
                    <Typography weight='semibold' size='xl'>
                        {title}
                    </Typography>
                    <Button
                        ripple
                        size='icon'
                        variant='ghost'
                        intent='secondary'
                        className='ml-auto'
                        onClick={() => setActiveMenu('editContact')}
                    >
                        <EditIcon className='size-6 text-primary-gray' />
                    </Button>
                </div>
                <div className='flex flex-col items-center justify-center px-5 py-8'>
                    <Image
                        src={avatarUrl}
                        skeleton={<AvatarByName name={name} size='5xl' />}
                        className='object-cover object-center size-28 rounded-full'
                    />
                    <Typography weight='semibold' size='xl' className='mt-2'>
                        {name}
                    </Typography>
                    {description && (
                        <Typography as='p' variant='secondary'>
                            {description}
                        </Typography>
                    )}
                </div>
                {info && (
                    <div className='flex flex-col px-3'>
                        {info.map(({ data, type }) => {
                            if (!data) return null;

                            const Icon = iconMap[type];

                            return (
                                <Button
                                    key={type}
                                    ripple
                                    variant='ghost'
                                    intent='secondary'
                                    onClick={() => onCopyToClipboard(type, data)}
                                    className='relative flex flex-col items-start pl-16 box-border h-auto whitespace-normal text-left text-md'
                                >
                                    <Icon className='absolute left-4 top-1/2 -translate-y-1/2' />
                                    <Typography variant='primary'>{data}</Typography>
                                    <Typography variant='secondary'>{type}</Typography>
                                </Button>
                            );
                        })}
                    </div>
                )}
                {tabs && (
                    <>
                        <SidebarMenuSeparator className='mb-0' />
                        <div className='flex flex-col gap-2 h-full overflow-auto'>
                            <div className='flex items-center overflow-x-auto scrollbar-hide box-border border-b border-solid border-primary-dark-200 min-h-10'>
                                {tabs.map((type, index) => (
                                    <Button
                                        ripple
                                        key={index}
                                        variant='ghost'
                                        className={cn(
                                            'outline-none min-w-fit flex-1 capitalize text-base px-5 py-2 rounded-none',
                                            index === activeTab && 'dark:!bg-primary-dark-50'
                                        )}
                                        onClick={() => setActiveTab(index)}
                                    >
                                        <Typography
                                            weight='medium'
                                            className={cn(
                                                'relative',
                                                index === activeTab && 'after:absolute after:left-0 after:-bottom-2 after:z-10 after:w-full after:h-0.5 after:bg-primary-white'
                                            )}
                                        >
                                            {type}
                                        </Typography>
                                    </Button>
                                ))}
                            </div>
                            {tabsMap[tabs[activeTab]]}
                        </div>
                    </>
                )}
            </div>
            {activeMenu && menus[activeMenu]}
        </div>
    );
};