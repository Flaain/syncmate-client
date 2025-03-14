import { AvatarByName } from '@/shared/ui/AvatarByName';
import { Image } from '@/shared/ui/Image';
import { MessageGroupProps } from '../model/types';
import { cn } from '@/shared/lib/utils/cn';
import { Message } from '@/entities/Message';
import { useSession } from '@/entities/session';
import { useChat } from '@/shared/lib/providers/chat/context';
import { useShallow } from 'zustand/shallow';
import { Message as IMessage, SourceRefPath } from '@/entities/Message/model/types';
import { useLayout } from '@/shared/model/store';

export const GroupedMessages = ({ messages, isLastGroup }: MessageGroupProps) => {
    const { params, textareaRef, mode, handleSelectMessage } = useChat(useShallow((state) => ({
        textareaRef: state.refs.textareaRef,
        params: state.params, 
        mode: state.mode, 
        handleSelectMessage: state.actions.handleSelectMessage 
    })));

    const userId = useSession((state) => state.userId);
    const message = messages[0];
    const isMessageFromMe = message.sender._id === userId;

    const handleDoubleClick = (message: IMessage) => {
        useLayout.setState((prevState) => {
            const newState = new Map([...prevState.drafts]);

            newState.set(params.id, { state: 'reply', value: '', selectedMessage: message });

            return { drafts: newState };
        })

        textareaRef.current?.focus();
    }

    return (
        <li className={cn('flex items-end gap-3 xl:self-start w-full', isMessageFromMe ? 'self-end' : 'self-start')}>
            <Image
                src={message.sourceRefPath === SourceRefPath.CONVERSATION ? message.sender.avatar?.url : (message.sender.participant?.avatar?.url || message.sender.avatar?.url)}
                skeleton={<AvatarByName name={message.sourceRefPath === SourceRefPath.CONVERSATION ? message.sender.name : (message.sender.participant?.name || message.sender.name)} className='sticky bottom-0 max-xl:hidden' />}
                className='object-cover min-w-[40px] max-w-[40px] h-10 sticky bottom-0 rounded-full max-xl:hidden z-[999]'
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
                        onDoubleClick={mode !== 'selecting' ? () => handleDoubleClick(message) : undefined}
                    />
                ))}
            </ul>
        </li>
    );
};