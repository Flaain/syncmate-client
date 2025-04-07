import { SendMessage } from '@/features/SendMessage/ui/ui';
import { showDetailsSelector, useChat } from '@/shared/lib/providers/chat';
import { OutletDetailsTypes } from '@/shared/model/types';
import { OutletContainer } from '@/shared/ui/OutletContainer';
import { Pattern } from '@/shared/ui/Pattern';
import { MessagesList } from '@/widgets/MessagesList';
import { OutletDetails } from '@/widgets/OutletDetails';
import { OutletHeader } from '@/widgets/OutletHeader';
import { useShallow } from 'zustand/shallow';
import { conversationApi } from '../../api';
import { getConversationDescription } from '../../lib/getConversationDescription';
import { useConversation } from '../../model/context';
import { contentSelector } from '../../model/selectors';
import { ConversationDDM } from '../DropdownMenu';

export const Content = () => {
    const { _id, isInitiatorBlocked, isRecipientBlocked, recipient, isRecipientTyping, handleTypingStatus } = useConversation(useShallow(contentSelector));

    const description = getConversationDescription({ data: { recipient, isInitiatorBlocked, isRecipientBlocked }, isRecipientTyping });
    const showDetails = useChat(showDetailsSelector);

    return (
        <OutletContainer>
            <div className='flex-1 flex flex-col relative'>
                <Pattern />
                <OutletHeader
                    name={recipient.name}
                    isOfficial={recipient.isOfficial}
                    description={description}
                    dropdownContent={<ConversationDDM />}
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
            {showDetails && (
                <OutletDetails
                    title='User Info'
                    name={recipient.name}
                    avatarUrl={recipient.avatar?.url}
                    description={description}
                    info={[
                        { data: recipient.status, type: OutletDetailsTypes.BIO },
                        { data: recipient.login, type: OutletDetailsTypes.LOGIN }
                    ]}
                />
            )}
        </OutletContainer>
    );
};