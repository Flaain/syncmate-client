import React from 'react';

import { RouteObject } from 'react-router-dom';

import { routerList } from '@/shared/constants';
import { ChatProvider } from '@/shared/lib/providers/chat';
import { Button } from '@/shared/ui/button';
import { ChatSkeleton } from '@/shared/ui/ChatSkeleton';
import { OutletError } from '@/shared/ui/OutletError';

import { View } from './model/view';

const fallback = ChatSkeleton();

export const ConversationPage: RouteObject = {
    path: routerList.CONVERSATION,
    element: (
        <React.Suspense fallback={fallback}>
            <ChatProvider>
                <View fallback={fallback} />
            </ChatProvider>
        </React.Suspense>
    ),
    errorElement: (
        <OutletError
            title='Failed to load conversation'
            description='Please try to refresh the page'
            callToAction={
                <Button className='mt-3' onClick={() => window.location.reload()}>
                    Refresh page
                </Button>
            }
        />
    )
};