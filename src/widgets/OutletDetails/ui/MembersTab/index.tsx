import { useGroup } from '@/pages/Group/model/context';
import { getRelativeTimeString } from '@/shared/lib/utils/getRelativeTimeString';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Image } from '@/shared/ui/Image';
import { Typography } from '@/shared/ui/Typography';
import { Link } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';
import { groupApi } from '@/pages/Group/api';
import { useQuery } from '@/shared/lib/hooks/useQuery';
import { Button } from '@/shared/ui/button';
import { Loader2 } from 'lucide-react';
import { MembersTabSkeleton } from '../Skeletons/MembersTabSkeleton';
import { useInfiniteScroll } from '@/shared/lib/hooks/useInfiniteScroll';
import { DataWithCursor, GroupParticipant } from '@/pages/Group/model/types';

export const MembersTab = () => {
    const { groupId, mySelf } = useGroup(useShallow((state) => ({ groupId: state.group._id, mySelf: state.group.me })));
    const { data: participants, setData, refetch, isRefetching, isLoading, isError } = useQuery(({ signal }) => groupApi.participants(groupId, signal));
    const { ref } = useInfiniteScroll<HTMLLIElement, DataWithCursor<GroupParticipant>>(
        ({ signal }) => groupApi.participants(groupId, signal, participants?.nextCursor),
        {
            deps: [participants?.nextCursor],
            onSuccess: ({ data, nextCursor }) => setData((prevState) => ({ data: [...prevState.data, ...data], nextCursor }))
        }
    );

    if (isLoading) return <MembersTabSkeleton />

    if (isError) {
        return (
            <div className='flex flex-col items-center justify-center gap-2 h-full px-5'>
                <Typography as='h2' weight='medium' align='center'>
                    Error appears while trying to fetch participants
                </Typography>
                <Button onClick={refetch}>{isRefetching ? <Loader2 className='size-5 animate-spin' /> : 'try again'}</Button>
            </div>
        );
    }

    return (
        <ul className='flex flex-col px-5 overflow-auto'>
            {participants?.data.map((participant, index, array) => (
                <li key={participant._id} ref={index === array.length - 1 ? ref : null}>
                    <Link
                        className='flex items-center gap-5 px-3 py-2 hover:bg-primary-dark-50 rounded-xl transition-colors ease-in-out duration-200'
                        to={`/conversation/${participant.user._id}`}
                    >
                        <Image
                            src={participant.avatar?.url}
                            skeleton={<AvatarByName name={participant.name ?? participant.user.name} size='md' />}
                            className='object-cover object-center size-10 rounded-full'
                        />
                        <div>
                            <Typography as='h2' weight='medium'>
                                {participant.name ?? participant.user.name}
                            </Typography>
                            <Typography variant='secondary'>
                                {getRelativeTimeString(participant.user.lastSeenAt)}
                            </Typography>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    );
};