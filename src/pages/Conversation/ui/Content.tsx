import { useShallow } from 'zustand/shallow';

import { MessagesList } from '@/widgets/messages-list';
import { OutletDetails } from '@/widgets/outlet-details';
import { OutletHeader } from '@/widgets/outlet-header';

import { SendMessage } from '@/features/send-message';

import { showDetailsSelector, useChat } from '@/shared/lib/providers/chat';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Image } from '@/shared/ui/Image';
import { OutletContainer } from '@/shared/ui/OutletContainer';
import { Pattern } from '@/shared/ui/Pattern';

import { conversationApi } from '../api';
import { useConversation } from '../model/context';
import { contentSelector } from '../model/selectors';
import { getDescription } from '../utils/getConversationDescription';

import { DDM } from './DDM';

export const Content = () => {
    const { _id, isInitiatorBlocked, isRecipientBlocked, recipient, isRecipientTyping, handleTypingStatus } = useConversation(useShallow(contentSelector));

    const description = getDescription({ 
        lastSeenAt: recipient.lastSeenAt, 
        presence: recipient.presence, 
        isInitiatorBlocked, 
        isRecipientBlocked, 
        isRecipientTyping 
    });

    const showDetails = useChat(showDetailsSelector);

    return (
        <OutletContainer>
            <div className='flex-1 flex flex-col relative'>
                <Pattern />
                <OutletHeader
                    avatar={
                        <Image
                            src={recipient.avatar?.url}
                            skeleton={<AvatarByName name={recipient.name} size='md' />}
                            className='object-cover object-center min-w-10 max-w-10 h-10 rounded-full'
                        />
                    }
                    name={recipient.name}
                    isOfficial={recipient.isOfficial}
                    description={description}
                    dropdownContent={<DDM />}
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
                        { data: recipient.bio, type: 'bio' },
                        { data: recipient.login, type: 'login' }
                    ]}
                />
            )}
        </OutletContainer>
    );
};