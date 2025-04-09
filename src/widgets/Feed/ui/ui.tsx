import SearchDuck from '@/shared/lib/assets/webp/search_duck.webp';
import { Image } from '@/shared/ui/Image';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/button';
import { globalFeedItems, globalFilters, localFeedItems, localFilters } from '@/widgets/Sidebar/model/constants';
import { useSidebar } from '@/widgets/Sidebar/model/context';
import React from 'react';
import { useShallow } from 'zustand/shallow';
import { feedSelector } from '../model/selectors';
import { FeedTypes } from '../model/types';
import FeedSkeleton from './Skeletons/FeedSkeleton';

export const Feed = () => {
    const { isSearching, searchValue, localResults, globalResults } = useSidebar(useShallow(feedSelector));

    const filteredLocalResults = React.useMemo(() => localResults.filter((item) => item.type === FeedTypes.ADS || localFilters[item.type](item, searchValue)), [localResults, searchValue]);
    const filteredGlobalResults = React.useMemo(() => globalResults?.items?.filter((item) => !globalFilters[item.type](item, localResults)), [globalResults, searchValue]);

    if (!isSearching && !filteredLocalResults.length && !filteredGlobalResults?.length) {
        return !searchValue.trim().length ? (
            <FeedSkeleton skeletonsCount={3} />
        ) : (
            <>
                <Image src={SearchDuck} className='self-center size-20' />
                <Typography as='p' variant='secondary' className='line-clamp-3 break-words px-3 box-border text-center'>
                    There were no results for "{searchValue}".
                </Typography>
            </>
        );
    }

   return (
       <>
           {!!filteredLocalResults.length && (
               <ul className='flex flex-col px-3 overflow-auto'>
                   {filteredLocalResults.map((item) => localFeedItems[item.type](item))}
               </ul>
           )}
           {(!!filteredGlobalResults?.length || isSearching) && (
               <div className='flex flex-col gap-2'>
                   <div className='flex items-center justify-between px-3 py-2 rounded bg-primary-dark-200'>
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
                       <ul className='flex flex-col overflow-auto px-3'>
                           {filteredGlobalResults?.map((item) => globalFeedItems[item.type](item))}
                       </ul>
                   )}
               </div>
           )}
       </>
   );
};