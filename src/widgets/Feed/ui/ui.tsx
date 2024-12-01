import FeedSkeleton from './Skeletons/FeedSkeleton';
import { Typography } from '@/shared/ui/Typography';
import { useSidebar } from '@/widgets/Sidebar/model/context';
import { useShallow } from 'zustand/shallow';
import { feedItems, globalFilters, localFilters } from '@/widgets/Sidebar/model/constants';
import { FeedTypes } from '../types';
import { Image } from '@/shared/ui/Image';
import { getImageUrl } from '@/shared/lib/utils/getImageUrl';

export const Feed = () => {
    const { isSearching, searchValue, localResults, globalResults } = useSidebar(useShallow((state) => ({
        isSearching: state.isSearching,
        searchValue: state.searchValue,
        localResults: state.localResults.feed,
        globalResults: state.globalResults
    })));

    const filteredLocalResults = localResults.filter((item) => item.type === FeedTypes.ADS || localFilters[item.type](item, searchValue));
    const filteredGlobalResults = globalResults?.items?.filter((item) => !globalFilters[item.type](item, localResults));
    
    if (!isSearching && !filteredLocalResults.length && !filteredGlobalResults?.length) {
        return !searchValue.trim().length ? (
            <FeedSkeleton skeletonsCount={3} />
        ) : (
            <>
                <Image src={getImageUrl('webp/search_duck.webp')} className='self-center size-20' />
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
                    {filteredLocalResults.map((item) => feedItems[item.type](item))}
                </ul>
            )}
            {(!!filteredGlobalResults?.length || isSearching) && (
                <div className='flex flex-col gap-2'>
                    <Typography as='h3' variant='secondary' className='px-3 py-2 rounded bg-primary-dark-200'>
                        Global results
                    </Typography>
                    {isSearching ? (
                        <FeedSkeleton skeletonsCount={3} animate />
                    ) : (
                        <ul className='flex flex-col overflow-auto px-3'>
                            {filteredGlobalResults?.map((item) => feedItems[item.type](item))}
                        </ul>
                    )}
                </div>
            )}
        </>
    );
};