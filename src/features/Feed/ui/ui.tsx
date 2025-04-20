import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/button';

import { FeedProps, GlobalFeedType, LocalFeedType } from '../model/types';

import { ConversationItem } from './ConversationItem';
import { FeedSkeleton } from './Skeleton';
import { UserItem } from './UserItem';
import { useFeed } from '../model/useFeed';
import { SearchX } from 'lucide-react';

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
            <FeedSkeleton skeletonsCount={3} animate={isLoading} />
        ) : (
            <>
                <SearchX className='mx-auto size-12 dark:text-primary-dark-50 mb-2' />
                <Typography as='p' variant='secondary' className='line-clamp-3 break-words px-4 box-border text-center'>
                    There were no results for "{searchValue}".
                </Typography>
            </>
        );
    }

   return (
       <>
           {!!filteredLocalResults?.length && (
               <ul className='flex flex-col px-4 overflow-auto'>
                   {filteredLocalResults.map((item) => localFeedItemsMap[item.type](item))}
               </ul>
           )}
           {(!!filteredGlobalResults?.length || isSearching) && (
               <div className='flex flex-col gap-2'>
                   <div className='flex items-center justify-between px-4 py-2 rounded bg-primary-dark-200'>
                       <Typography as='h3' variant='secondary'>
                           Global results
                       </Typography>
                       {!isSearching && globalResults?.meta.next_page && (
                           <Button size='icon' variant='text'>
                               show more
                           </Button>
                       )}
                   </div>
                   {isSearching ? (
                       <FeedSkeleton skeletonsCount={3} animate />
                   ) : (
                       <ul className='flex flex-col overflow-auto px-4'>
                           {filteredGlobalResults?.map((item) => globalFeedItems[item.type](item))}
                       </ul>
                   )}
               </div>
           )}
       </>
   );
};