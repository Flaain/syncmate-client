import { OutletHeader } from '@/widgets/OutletHeader';
import { OutletDetails } from '@/widgets/OutletDetails';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Image } from '@/shared/ui/Image';
import { useConversation } from '../../model/context';
import { getConversationDescription } from '../../lib/getConversationDescription';
import { OutletContainer } from '@/shared/ui/OutletContainer';
import { RecipientDetails } from '../RecipientDetails';
import { ConversationDDM } from '../DropdownMenu';
import { useChat } from '@/shared/lib/providers/chat/context';
import { useShallow } from 'zustand/shallow';
import { SendMessage } from '@/features/SendMessage/ui/ui';
import { contentSelector } from '../../model/selectors';
import { MessagesList } from '@/widgets/MessagesList';

export const Content = () => {
    const {
        _id,
        isInitiatorBlocked,
        isRecipientBlocked,
        recipient,
        isRecipientTyping,
        handleTypingStatus,
        handleOptimisticUpdate,
        getPreviousMessages
    } = useConversation(useShallow(contentSelector));

    const showDetails = useChat((state) => state.showDetails);
    const description = getConversationDescription({
        data: { recipient, isInitiatorBlocked, isRecipientBlocked },
        isRecipientTyping
    });
console.log('rerender in content');
    return (
        <OutletContainer>
            <div className='flex-1 flex flex-col'>
                <OutletHeader
                    name={recipient.name}
                    isOfficial={recipient.isOfficial}
                    description={description}
                    dropdownMenu={<ConversationDDM />}
                />
                <MessagesList getPreviousMessages={getPreviousMessages} />
                <SendMessage
                    onOptimisticUpdate={handleOptimisticUpdate}
                    handleTypingStatus={handleTypingStatus()}
                    restrictMessaging={[
                        {
                            reason: !!(isInitiatorBlocked || isRecipientBlocked),
                            message: isRecipientBlocked
                                ? `You blocked ${recipient.name}`
                                : `${recipient.name} has restricted incoming messages`
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
                    name={recipient.name}
                    avatarSlot={
                        <Image
                            src={recipient.avatar?.url}
                            skeleton={<AvatarByName name={recipient.name} size='5xl' />}
                            className='object-cover object-center size-28 rounded-full'
                        />
                    }
                    description={description}
                    info={<RecipientDetails recipient={recipient} />}
                />
            )}
        </OutletContainer>
    );
};
