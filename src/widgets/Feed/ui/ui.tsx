import { useMemo } from 'react';

import { useShallow } from 'zustand/shallow';

import SearchDuck from '@/shared/lib/assets/webp/search_duck.webp';
import { Image } from '@/shared/ui/Image';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/button';
import { useSidebar } from '@/widgets/Sidebar/model/context';

import { feedSelector } from '../model/selectors';
import { getFilteredGlobalResults, getFilteredLocalResults } from '../utils/feedFilters';
import { GlobalFeedType, LocalFeedType } from '../model/types';

import { ConversationItem } from './ConversationItem';
import { FeedSkeleton } from './Skeleton';
import { UserItem } from './UserItem';

const globalFeedItems: GlobalFeedType = {
    User: (item) => <UserItem user={item} key={item._id} />,
};

const localFeedItemsMap: LocalFeedType = {
    Conversation: (feedItem) => <ConversationItem key={feedItem._id} feedItem={feedItem} />,
}

export const Feed = () => {
    const { isSearching, searchValue, localResults, globalResults } = useSidebar(useShallow(feedSelector));

    const filteredLocalResults = useMemo(() => localResults.filter((item) => getFilteredLocalResults(item, searchValue)), [localResults, searchValue]);
    const filteredGlobalResults = useMemo(() => globalResults?.items?.filter((item) => getFilteredGlobalResults(item, filteredLocalResults)), [globalResults, filteredLocalResults]);

    if (!isSearching && !filteredLocalResults.length && !filteredGlobalResults?.length) {
        return !searchValue.trim().length ? (
            <FeedSkeleton skeletonsCount={3} />
        ) : (
            <>
                <Image src={SearchDuck} className='self-center size-20' />
                <Typography as='p' variant='secondary' className='line-clamp-3 break-words px-4 box-border text-center'>
                    There were no results for "{searchValue}".
                </Typography>
            </>
        );
    }

   return (
       <>
           {!!filteredLocalResults.length && (
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