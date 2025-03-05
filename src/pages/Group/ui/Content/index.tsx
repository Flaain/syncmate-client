import { OutletContainer } from '@/shared/ui/OutletContainer';
import { useGroup } from '../../model/context';
import { OutletHeader } from '@/widgets/OutletHeader';
import { MessagesList } from '@/widgets/MessagesList';
import { SendMessage } from '@/features/SendMessage/ui/ui';
import { useChat } from '@/shared/lib/providers/chat/context';
import { OutletDetails } from '@/widgets/OutletDetails';
import { OutletDetailsTypes } from '@/shared/model/types';
import { DETAILS_TABS } from '@/widgets/OutletDetails/model/types';

export const Content = () => {
    const group = useGroup((state) => state.group);
    const showDetails = useChat((state) => state.showDetails);
    const description = `${group.participants} ${group.participants > 1 ? 'members' : 'member'}`;

    return (
        <OutletContainer>
            <div className='flex-1 flex flex-col'>
                <OutletHeader name={group.name} isOfficial={group.isOfficial} description={description} />
                <MessagesList getPreviousMessages={(id, cursor) => {}} />
                <SendMessage />
            </div>
            {showDetails && (
                <OutletDetails
                    title='Group Info'
                    description={description}
                    name={group.name}
                    avatarUrl={group.avatar?.url}
                    info={[{ data: group.login, type: OutletDetailsTypes.LOGIN }]}
                    tabs={[DETAILS_TABS.MEMBERS, DETAILS_TABS.MEDIA, DETAILS_TABS.FILES, DETAILS_TABS.MUSIC, DETAILS_TABS.VOICE]}
                />
            )}
        </OutletContainer>
    );
};