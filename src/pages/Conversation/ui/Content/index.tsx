import { OutletHeader } from '@/widgets/OutletHeader';
import { OutletDetails } from '@/widgets/OutletDetails';
import { useConversation } from '../../model/context';
import { getConversationDescription } from '../../lib/getConversationDescription';
import { OutletContainer } from '@/shared/ui/OutletContainer';
import { ConversationDDM } from '../DropdownMenu';
import { useShallow } from 'zustand/shallow';
import { SendMessage } from '@/features/SendMessage/ui/ui';
import { contentSelector } from '../../model/selectors';
import { MessagesList } from '@/widgets/MessagesList';
import { OutletDetailsTypes } from '@/shared/model/types';
import { conversationApi } from '../../api';

export const Content = () => {
    const { _id, isInitiatorBlocked, isRecipientBlocked, recipient, isRecipientTyping, handleTypingStatus } = useConversation(useShallow(contentSelector));

    const description = getConversationDescription({ data: { recipient, isInitiatorBlocked, isRecipientBlocked }, isRecipientTyping });

    return (
        <OutletContainer>
            <div className='flex-1 flex flex-col'>
                <OutletHeader
                    name={recipient.name}
                    isOfficial={recipient.isOfficial}
                    description={description}
                    dropdownMenu={<ConversationDDM />}
                />
                <MessagesList getPreviousMessages={(id, cursor) => conversationApi.getPreviousMessages(id, cursor)} />
                <SendMessage
                    handleTypingStatus={handleTypingStatus()}
                    restrictMessaging={[
                        {
                            reason: !!(isInitiatorBlocked || isRecipientBlocked),
                            message: isRecipientBlocked ? `You blocked ${recipient.name}` : `${recipient.name} has restricted incoming messages`
                        },
                        {
                            reason: !_id && recipient.isPrivate,
                            message: `${recipient.name} does not accept new messages`
                        }
                    ]}
                />
            </div>
            <OutletDetails
                title='User Info'
                name={recipient.name}
                avatarUrl={recipient.avatar?.url}
                description={description}
                info={[
                    { data: recipient.status, type: OutletDetailsTypes.BIO },
                    { data: recipient.login, type: OutletDetailsTypes.LOGIN },
                ]}
            />
        </OutletContainer>
    );
};