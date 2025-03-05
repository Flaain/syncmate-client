import Verified from '@/shared/lib/assets/icons/verified.svg?react';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Typography } from '@/shared/ui/Typography';
import { Image } from '@/shared/ui/Image';
import { ProfileIndicator } from '@/shared/ui/ProfileIndicator';
import { cn } from '@/shared/lib/utils/cn';
import { NavLink } from 'react-router-dom';
import { useLayout } from '@/shared/model/store';
import { FeedTypes } from '../../types';
import { PRESENCE } from '@/entities/profile/model/types';
import { ExctactLocalFeedItem } from '@/widgets/Sidebar/model/types';

export const ConversationItem = ({ feedItem: { item } }: { feedItem: ExctactLocalFeedItem<FeedTypes.CONVERSATION> }) => {
    const recipient = item.recipient;
    const draft = useLayout((state) => state.drafts).get(recipient._id);

    return (
        <li>
            <NavLink
                state={recipient}
                to={`/conversation/${recipient._id}`}
                className={({ isActive }) =>
                    cn(
                        'flex items-center gap-5 p-2 rounded-lg transition-colors duration-200 ease-in-out',
                        isActive
                            ? 'dark:bg-primary-dark-50 bg-primary-gray/10'
                            : 'dark:hover:bg-primary-dark-50/30 hover:bg-primary-gray/5'
                    )
                }
            >
                {recipient.avatar ? (
                    <span className='relative w-[50px] h-[50px]'>
                        <Image
                            src={recipient.avatar.url}
                            skeleton={<AvatarByName name={recipient.name} size='lg' />}
                            className='object-cover object-center min-w-[50px] max-w-[50px] h-[50px] rounded-full'
                        />
                        {recipient.presence === PRESENCE.ONLINE && <ProfileIndicator />}
                    </span>
                ) : (
                    <AvatarByName name={recipient.name} size='lg' isOnline={recipient.presence === PRESENCE.ONLINE} />
                )}
                <div className='flex flex-col items-start w-full overflow-hidden'>
                    <Typography
                        as='h2'
                        weight='medium'
                        className='flex w-full items-center'
                    >
                        {recipient.name}
                        {recipient.isOfficial && (
                            <Typography className='ml-2'>
                                <Verified className='w-5 h-5' />
                            </Typography>
                        )}
                        {!!item.unreadMessages && (
                            <span className='text-primary-dark-200 font-semibold text-sm flex items-center justify-center ml-auto size-5 rounded-full bg-primary-white'>
                                {item.unreadMessages}
                            </span>
                        )}
                    </Typography>
                    {!!item.participantsTyping?.length ? (
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
                        !!item.lastMessage && (
                            <div className='flex items-center w-full gap-5'>
                                <Typography className='break-all dark:text-primary-white/30 text-primary-gray line-clamp-1'>
                                    {item.lastMessage?.text}
                                </Typography>
                                <Typography className='ml-auto' variant='secondary'>
                                    {new Date(item.lastMessage.createdAt).toLocaleTimeString(navigator.language, {
                                        hour: 'numeric',
                                        minute: 'numeric'
                                    })}
                                </Typography>
                            </div>
                        )
                    )}
                </div>
            </NavLink>
        </li>
    );
};