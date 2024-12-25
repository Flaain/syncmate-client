import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Image } from '@/shared/ui/Image';
import { MessageGroupProps } from '../model/types';
import { cn } from '@/shared/lib/utils/cn';
import { Message } from '@/entities/Message';
import { useSession } from '@/entities/session';
import { useChat } from '@/shared/lib/providers/chat/context';
import { useShallow } from 'zustand/shallow';
import { SourceRefPath } from '@/entities/Message/model/types';

export const GroupedMessages = ({ messages, isLastGroup }: MessageGroupProps) => {
    const { mode, handleSelectMessage } = useChat(useShallow((state) => ({
        mode: state.mode,
        handleSelectMessage: state.actions.handleSelectMessage
    })));

    const userId = useSession((state) => state.userId);
    const message = messages[0];
    const isMessageFromMe = message.sender._id === userId;

    return (
        <li className={cn('flex items-end gap-3 xl:self-start w-full', isMessageFromMe ? 'self-end' : 'self-start')}>
            <Image
                src={message.sourceRefPath === SourceRefPath.CONVERSATION ? message.sender.avatar?.url : (message.sender.participant?.avatar?.url || message.sender.avatar?.url)}
                skeleton={<AvatarByName name={message.sourceRefPath === SourceRefPath.CONVERSATION ? message.sender.name : (message.sender.participant?.name || message.sender.name)} className='sticky bottom-0 max-xl:hidden' />}
                className='object-cover size-10 sticky bottom-0 rounded-full max-xl:hidden z-[999]'
            />
            <ul className='flex flex-col gap-1 w-full'>
                {messages.map((message, index, array) => (
                    <Message
                        key={message._id}
                        isFirst={!index}
                        isMessageFromMe={isMessageFromMe}
                        isLastGroup={isLastGroup}
                        isLast={index === array.length - 1}
                        message={message}
                        onClick={mode === 'selecting' && isMessageFromMe ? () => handleSelectMessage(message) : undefined}
                    />
                ))}
            </ul>
        </li>
    );
};