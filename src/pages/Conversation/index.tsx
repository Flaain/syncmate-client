import React from 'react';
import { routerList } from '@/shared/constants';
import { RouteObject } from 'react-router-dom';
import { View } from './model/view';
import { Button } from '@/shared/ui/button';
import { OutletError } from '@/shared/ui/OutletError';
import { ConversationProvider } from './model/provider';
import { ChatProvider } from '@/shared/lib/providers/chat/provider';
import { OutletSkeleton } from '@/shared/ui/OutletSkeleton';

export const ConversationPage: RouteObject = {
    path: routerList.CONVERSATION,
    element: (
        <React.Suspense fallback={<OutletSkeleton />}>
            <ChatProvider>
                <ConversationProvider>
                    <View />
                </ConversationProvider>
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