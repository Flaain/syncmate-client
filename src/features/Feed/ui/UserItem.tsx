import { NavLink } from 'react-router-dom';

import Verified from '@/shared/lib/assets/icons/verified.svg?react';
import { cn } from '@/shared/lib/utils/cn';
import { useLayout } from '@/shared/model/store';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Image } from '@/shared/ui/Image';
import { Typography } from '@/shared/ui/Typography';

import { UserFeed } from '../../model/types';

export const UserItem = ({ user }: { user: UserFeed }) => {
    const draft = useLayout((state) => state.drafts).get(user._id);

    return (
        <li>
            <NavLink
                state={user}
                to={`/conversation/${user._id}`}
                className={({ isActive }) =>
                    cn(
                        'flex items-center gap-5 p-2 rounded-lg transition-colors duration-200 ease-in-out',
                        isActive ? 'dark:bg-primary-dark-50 bg-primary-gray/10' : 'dark:hover:bg-primary-dark-50/30 hover:bg-primary-gray/5'
                    )
                }
            >
                <Image
                    src={user.avatar?.url}
                    skeleton={<AvatarByName name={user.name} size='lg' />}
                    className='object-cover object-center max-w-[50px] max-h-[50px] min-w-[50px] min-h-[50px] size-full rounded-full'
                />
                <div className='flex flex-col items-start w-full'>
                    <Typography as='h2' weight='medium' className={cn(user.isOfficial && 'flex items-center')}>
                        {user.name}
                        {user.isOfficial && (
                            <Typography className='ml-2'>
                                <Verified className='w-5 h-5' />
                            </Typography>
                        )}
                    </Typography>
                    {draft?.state === 'send' ? (
                        <Typography as='p' variant='secondary' className='line-clamp-1'>
                            <Typography as='span' variant='error'>
                                Draft:&nbsp;
                            </Typography>
                            {draft.value}
                        </Typography>
                    ) : (
                        <Typography variant='secondary'>@{user.login}</Typography>
                    )}
                </div>
            </NavLink>
        </li>
    );
};