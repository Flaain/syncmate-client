import { NavLink } from 'react-router-dom';

import Verified from '@/shared/lib/assets/icons/verified.svg?react';

import { cn } from '@/shared/lib/utils/cn';
import { useLayout } from '@/shared/model/store';
import { PRESENCE } from '@/shared/model/types';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Image } from '@/shared/ui/Image';
import { OnlineIndicator } from '@/shared/ui/OnlineIndicator';
import { Typography } from '@/shared/ui/Typography';

import { ExctactFeedItem, FEED_TYPE, LocalFeed } from '../model/types';

export const ConversationItem = ({ feedItem: { item: { recipient, unreadMessages, participantsTyping, lastMessage } } }: { feedItem: ExctactFeedItem<LocalFeed, FEED_TYPE.CONVERSATION> }) => {
    const draft = useLayout((state) => state.drafts).get(recipient._id);

    return (
        <NavLink
            state={recipient}
            to={`/conversation/${recipient._id}`}
            className={({ isActive }) =>
                cn(
                    'flex items-center gap-4 p-2 rounded-[10px] transition-colors duration-200 ease-in-out',
                    isActive ? 'dark:bg-primary-dark-50 bg-primary-gray/10' : 'dark:hover:bg-primary-dark-50/30 hover:bg-primary-gray/5'
                )
            }
        >
            {recipient.avatar ? (
                <span className='relative size-[50px]'>
                    <Image
                        src={recipient.avatar.url}
                        skeleton={<AvatarByName name={recipient.name} size='lg' />}
                        className='object-cover object-center min-h-[50px] min-w-[50px] max-w-[50px] max-h-[50px] rounded-full'
                    />
                    {recipient.presence === PRESENCE.online && <OnlineIndicator />}
                </span>
            ) : (
                <AvatarByName name={recipient.name} size='lg' isOnline={recipient.presence === PRESENCE.online} />
            )}
            <div className='flex flex-col items-start w-full overflow-hidden'>
                <Typography
                    weight='medium'
                    className='flex w-full items-center'
                >
                    {recipient.name}
                    {recipient.isOfficial && <Verified className='size-5 text-primary-blue ml-1' />}
                    {!!unreadMessages && (
                        <Typography size='xs' className='dark:text-primary-white font-semibold p-1 min-w-6 min-h-6 flex items-center justify-center ml-auto rounded-full bg-primary-blue mb-1'>
                            {unreadMessages}
                        </Typography>
                    )}
                </Typography>
                {participantsTyping?.length ? (
                    <Typography as='p' variant='secondary' className='line-clamp-1'>
                        typing...
                    </Typography>
                ) : draft?.state === 'send' ? (
                    <Typography as='p' variant='secondary' className='line-clamp-1 break-all'>
                        <Typography as='span' variant='error'>
                            Draft:&nbsp;
                        </Typography>
                        {draft.value}
                    </Typography>
                ) : (
                    !!lastMessage && (
                        <div className='flex items-center w-full gap-5'>
                            <Typography as='p' className='break-all dark:text-primary-white/30 text-primary-gray line-clamp-1'>
                                {lastMessage?.text}
                            </Typography>
                            <Typography className='ml-auto dark:text-primary-white/30'>
                                {new Date(lastMessage.createdAt).toLocaleTimeString(navigator.language, { hour: 'numeric', minute: 'numeric' })}
                            </Typography>
                        </div>
                    )
                )}
            </div>
        </NavLink>
    );
};