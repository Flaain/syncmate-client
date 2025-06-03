import React from 'react';

import { useShallow } from 'zustand/shallow';

import { MessagesList } from '@/widgets/messages-list';
import { OutletDetails } from '@/widgets/outlet-details';
import { OutletHeader } from '@/widgets/outlet-header';

import { SendMessage } from '@/features/send-message';

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

    const getTypingStatus = React.useMemo(() => handleTypingStatus(), []);

    return (
        <OutletContainer>
            <div className='flex-1 flex flex-col relative'>
                <Pattern />
                <OutletHeader
                    avatarUrl={recipient.avatar?.url}
                    name={recipient.name}
                    isOfficial={recipient.isOfficial}
                    description={description}
                    dropdownContent={<DDM />}
                />
                <MessagesList getPreviousMessages={(id, cursor) => conversationApi.getPreviousMessages(id, cursor)} />
                <SendMessage
                    handleTypingStatus={getTypingStatus}
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
                    { data: recipient.bio, type: 'bio' },
                    { data: recipient.login, type: 'login' }
                ]}
            />
        </OutletContainer>
    );
};