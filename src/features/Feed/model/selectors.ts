import { SidebarStore } from '@/widgets/Sidebar/model/types';

export const feedSelector = (store: SidebarStore) => ({
    isSearching: store.isSearching,
    searchValue: store.searchValue,
    localResults: store.localResults.feed,
    globalResults: store.globalResults
});