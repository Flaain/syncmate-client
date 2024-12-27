import React from 'react';
import { OutletError } from '@/shared/ui/OutletError';
import { routerList } from '@/shared/constants';
import { RouteObject } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { View } from './model/view';
import { ChatProvider } from '@/shared/lib/providers/chat/provider';
import { GroupProvider } from './model/provider';
import { ChatSkeleton } from '@/shared/ui/ChatSkeleton';

export const GroupPage: RouteObject = {
    path: routerList.GROUP,
    element: (
        <React.Suspense fallback={<ChatSkeleton />}>
            <ChatProvider>
                <GroupProvider>
                    <View />
                </GroupProvider>
            </ChatProvider>
        </React.Suspense>
    ),
    errorElement: (
        <OutletError
            title='Failed to load group'
            description='Please try to refresh the page'
            callToAction={
                <Button className='mt-3' onClick={() => window.location.reload()}>
                    Refresh page
                </Button>
            }
        />
    )
};