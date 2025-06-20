import { useShallow } from 'zustand/shallow';

import { Message } from '@/entities/message';
import { profileSelector, useProfile } from '@/entities/profile';
import { useSession } from '@/entities/session';

import { groupedMessagesSelector, useChat } from '@/shared/lib/providers/chat';
import { cn } from '@/shared/lib/utils/cn';
import { useLayout } from '@/shared/model/store';
import { CHAT_TYPE, Message as IMessage, MessageUnionFields } from '@/shared/model/types';
import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Image } from '@/shared/ui/Image';

const avatarClasses = 'transition-transform bottom-[2px] duration-200 ease-in-out sticky max-xl:hidden z-[999]';

export interface MessageGroupProps {
    messages: Array<IMessage>;
    isLastGroup: boolean;
    firstMessageRef: ((node: HTMLDivElement) => void) | null;
}

export const UserGroup = ({ messages, firstMessageRef, isLastGroup }: MessageGroupProps) => {
    const { params, textareaRef, chatInfo, mode, handleSelectMessage } = useChat(useShallow(groupedMessagesSelector));
    const { avatar } = useProfile(useShallow(profileSelector));
    
    const userId = useSession((state) => state.userId);

    const message = messages[0];
    const isMessageFromMe = message.sender._id === userId;
    const isSelecting = mode === 'selecting';
    const animatedAvatarClasses = isSelecting && isMessageFromMe ? 'scale-[80%] translate-y-1' : 'scale-100';

    const handleDoubleClick = (message: IMessage) => {
        useLayout.setState((prevState) => {
            const newState = new Map(prevState.drafts);

            newState.set(params.id, { state: 'reply', value: '', selectedMessage: message });

            return { drafts: newState };
        })

        requestAnimationFrame(() => textareaRef.current?.focus());
    }

    return (
        <div className='flex items-end gap-3 xl:self-start w-full first-of-type:mt-auto'>
            <Image
                src={isMessageFromMe ? avatar?.url : params.type === CHAT_TYPE.Conversation ? chatInfo.avatar?.url : (message.sender as Extract<MessageUnionFields, { sourceRefPath: 'Group' }>['sender']).avatar?.url}
                skeleton={<AvatarByName name={message.sender.name} className={`${avatarClasses} ${animatedAvatarClasses}`} />}
                className={`object-cover min-w-[40px] max-w-[40px] h-10 rounded-full ${avatarClasses} ${animatedAvatarClasses}`}
            />
            <ul className={cn('flex flex-col gap-1 w-full xl:items-start', isMessageFromMe ? 'items-end' : 'items-start')}>
                {messages.map((message, index, array) => (
                    <Message
                        key={message._id}
                        firstMessageRef={!index ? firstMessageRef : null}
                        isFirst={!index}
                        isMessageFromMe={isMessageFromMe}
                        isLastGroup={isLastGroup}
                        isLast={index === array.length - 1}
                        message={message}
                        onClick={isSelecting && isMessageFromMe ? () => handleSelectMessage(message) : undefined}
                        onDoubleClick={!isSelecting ? () => handleDoubleClick(message) : undefined}
                    />
                ))}
            </ul>
        </div>
    );
};