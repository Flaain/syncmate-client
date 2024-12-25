import React from 'react';
import { Button } from '@/shared/ui/button';
import { X } from 'lucide-react';
import { Typography } from '@/shared/ui/Typography';
import { useEvents } from '@/shared/model/store';
import { useChat } from '@/shared/lib/providers/chat/context';
import { useShallow } from 'zustand/shallow';
import { OutletDetailsButton } from '@/shared/ui/OutletDetailsButton';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Image } from '@/shared/ui/Image';
import { cn } from '@/shared/lib/utils/cn';
import { MembersTab } from './MembersTab';
import { MediaTab } from './MediaTab';
import { DETAILS_TABS, OutletDetailsProps } from '../model/types';

const tabsMap: Record<DETAILS_TABS, React.ReactNode> = {
    members: <MembersTab />,
    media: <MediaTab />
};

export const OutletDetails = ({ avatarUrl, title, tabs, name, description, info }: OutletDetailsProps) => {
    const [activeTab, setActiveTab] = React.useState(0);

    const addEventListener = useEvents((state) => state.addEventListener);

    const { type, setChat } = useChat(useShallow((state) => ({
        type: state.params.type,
        setChat: state.actions.setChat
    })));

    React.useEffect(() => {
        const removeEventListener = addEventListener('keydown', (event) => {
            event.stopImmediatePropagation();

            event.key === 'Escape' && setChat({ showDetails: false });
        });

        return () => {
            removeEventListener();
        };
    }, []);

    return (
        <div className='flex flex-col max-xl:absolute max-xl:top-0 max-xl:right-0 z-[999] py-3 dark:bg-primary-dark-100 h-full max-w-[390px] w-full border-l-2 border-primary-dark-50'>
            <div className='flex items-center gap-5 px-5'>
                <Button onClick={() => setChat({ showDetails: false })} size='icon' variant='text' className='p-0'>
                    <X />
                </Button>
                <Typography weight='semibold' size='xl'>
                    {title}
                </Typography>
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
                <div className={cn('flex flex-col', tabs && 'border-b-[15px] pb-2 border-solid border-primary-dark-200')}>
                    {info.map(({ data, type }, index) => data ? <OutletDetailsButton key={index} data={data} type={type} /> : null)}
                </div>
            )}
            {tabs && (
                <div className='flex flex-col gap-2 h-full overflow-auto'>
                    <div className='flex items-center overflow-x-auto scrollbar-hide box-border border-b border-solid border-primary-dark-200 min-h-10'>
                        {tabs.map((type, index) => (
                            <Button
                                key={index}
                                size='icon'
                                variant='ghost'
                                className={cn('outline-none capitalize text-base px-5 py-2 rounded-none', index === activeTab && 'dark:bg-primary-dark-50')}
                                onClick={() => setActiveTab(index)}
                            >
                                <Typography weight='medium' className={(cn('relative', index === activeTab && 'after:absolute after:left-0 after:-bottom-2 after:z-10 after:w-full after:h-0.5 after:bg-primary-white'))}>
                                    {type}
                                </Typography>
                            </Button>
                        ))}
                    </div>
                    {tabsMap[tabs[activeTab]]}
                </div>
            )}
        </div>
    );
};