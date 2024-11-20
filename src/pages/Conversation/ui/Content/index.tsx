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
import { ConversationBody } from '../Body';
import { SendMessage } from '@/features/SendMessage/ui/ui';

export const Content = () => {
    const { _id, isInitiatorBlocked, isRecipientBlocked, recipient, isRecipientTyping, handleTypingStatus, handleOptimisticUpdate } = useConversation(useShallow((state) => ({
        _id: state.conversation._id,
        handleTypingStatus: state.actions.handleTypingStatus,
        handleOptimisticUpdate: state.actions.handleOptimisticUpdate,
        isInitiatorBlocked: state.conversation.isInitiatorBlocked,
        isRecipientBlocked: state.conversation.isRecipientBlocked,
        recipient: state.conversation.recipient,
        isRecipientTyping: state.isRecipientTyping
    })));

    const showDetails = useChat((state) => state.showDetails);
    const description = getConversationDescription({ data: { recipient, isInitiatorBlocked, isRecipientBlocked }, isRecipientTyping });

    return (
        <OutletContainer>
            <OutletHeader
                name={recipient.name}
                isOfficial={recipient.isOfficial}
                description={description}
                dropdownMenu={<ConversationDDM />}
            />
            <ConversationBody />
            <SendMessage
                onOptimisticUpdate={handleOptimisticUpdate}
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