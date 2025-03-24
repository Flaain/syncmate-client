import { OutletHeaderProps } from '../model/types';
import { useChat } from '@/shared/lib/providers/chat/context';
import { ChatMode } from '@/shared/lib/providers/chat/types';
import { DefaultState } from './DefaultState';
import { SelectState } from './SelectState';
import { useShallow } from 'zustand/shallow';

export const OutletHeader = (props: OutletHeaderProps) => {
    const { chatMode, setChat } = useChat(useShallow((state) => ({ chatMode: state.mode, setChat: state.actions.setChat })));

    const components: Record<ChatMode, React.ReactNode> = {
        default: <DefaultState {...props} />,
        selecting: <SelectState />
    };

    return (
        <div
            {...(chatMode === 'default' && { onClick: () => setChat({ showDetails: true }) })}
            className='flex items-center self-start size-full max-h-[70px] px-5 py-3 box-border dark:bg-primary-dark-100 bg-primary-white sticky top-0 z-[999] cursor-pointer'
        >
            {components[chatMode]}
        </div>
    );
};
