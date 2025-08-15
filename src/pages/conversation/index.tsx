import React from 'react';

import { RouteObject } from 'react-router-dom';

import { routerList } from '@/shared/constants';
import { ChatProvider } from '@/shared/lib/providers/chat';
import { CHAT_TYPE } from '@/shared/model/types';
import { ChatSkeleton } from '@/shared/ui/ChatSkeleton';

import { View } from './model/view';

const fallback = ChatSkeleton({ type: CHAT_TYPE.Conversation });

export { useConversation } from './model/context';

export const ConversationPage: RouteObject = {
    path: routerList.CONVERSATION,
    element: (
        <React.Suspense fallback={fallback}>
            <ChatProvider>
                <View fallback={fallback} />
            </ChatProvider>
        </React.Suspense>
    ),
    errorElement: fallback
};