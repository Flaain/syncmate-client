import DeleteUserIcon from '@/shared/lib/assets/icons/deleteuser.svg?react';

import { Button } from '@/shared/ui/button';
import { Typography } from '@/shared/ui/Typography';

import { FeedProps, GlobalFeedType, LocalFeedType } from '../model/types';
import { useFeed } from '../model/useFeed';

import { ConversationItem } from './ConversationItem';
import { FeedSkeleton } from './Skeleton';
import { UserItem } from './UserItem';

const globalFeedItems: GlobalFeedType = {
    User: (item) => <UserItem user={item} key={item._id} />,
};

const localFeedItemsMap: LocalFeedType = {
    Conversation: (feedItem) => <ConversationItem key={feedItem._id} feedItem={feedItem} />,
}

export const Feed = ({ globalResults, isSearching, searchValue }: FeedProps) => {
    const { isLoading, filteredGlobalResults, filteredLocalResults } = useFeed({ globalResults, searchValue });

    if (!isSearching && !filteredLocalResults?.length && !filteredGlobalResults?.length) {
        return !searchValue.trim().length ? (
            <FeedSkeleton animate={isLoading} className='pt-4' />
        ) : (
            <>
                <DeleteUserIcon className='mx-auto size-12 dark:text-primary-dark-50 mb-2' />
                <Typography as='p' variant='secondary' className='line-clamp-3 break-words px-4 box-border text-center'>
                    There were no results for "{searchValue}".
                    <br />
                    Try a new search.
                </Typography>
            </>
        );
    }

   return (
       <>
           {!!filteredLocalResults?.length && (
               <div className='flex flex-col px-4 overflow-auto py-3 h-auto min-h-48 box-border'>
                   {filteredLocalResults.map((item) => localFeedItemsMap[item.type](item))}
               </div>
           )}
           {(!!filteredGlobalResults?.length || isSearching) && (
               <div className='flex flex-col gap-2 overflow-hidden min-h-80'>
                   <div className='flex items-center justify-between px-4 py-2 bg-primary-dark-200 box-border'>
                       <Typography as='h3' variant='secondary'>
                           Global results
                       </Typography>
                       {!isSearching && globalResults?.meta.next_page && ( // TODO: rewrite to inf scroll
                           <Button size='text' variant='link'>
                               show more
                           </Button>
                       )}
                   </div>
                   {isSearching ? (
                       <FeedSkeleton skeletonsCount={3} animate />
                   ) : (
                       <div className='flex flex-col overflow-auto px-4 flex-1'>
                           {filteredGlobalResults?.map((item) => globalFeedItems[item.type](item))}
                       </div>
                   )}
               </div>
           )}
       </>
   );
};