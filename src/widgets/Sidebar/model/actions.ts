import { sessionApi, useSession } from "@/entities/session";
import { ApiException } from "@/shared/api/error";
import { MIN_USER_SEARCH_LENGTH } from "@/shared/constants";
import { debounce } from "@/shared/lib/utils/debounce";
import { SetStateInternal } from "@/shared/model/types";

import { sidebarApi } from "../api";

import { SidebarStore } from "./types";

export const sidebarActions = (set: SetStateInternal<SidebarStore>, get: () => SidebarStore): SidebarStore['actions'] => ({
    handleLogout: async () => {
        await sessionApi.logout();

        useSession.getState().actions.onSignout();
    },
    getFeed: async (signal?: AbortSignal) => {
        try {
            const { data } = await sidebarApi.get(signal);

            set({ localResults: data });
        } catch (error) {
            console.error(error);
            set({ localResultsError: error instanceof ApiException ? error.message : 'Failed to load feed' });
        }
    },
    resetSearch: () => {
        const { abortController, searchRef } = get();
        
        abortController.abort('Search request was cancelled');
        searchRef?.current?.focus();

        set({ searchValue: '', globalResults: null, isSearching: false, abortController: new AbortController() });
    },
    handleSearch: ({ target: { value } }) => {
        if (!value) return get().actions.resetSearch();
        
        const trimmedSearchValue = value.trim();
        
        set({ searchValue: trimmedSearchValue });

        if (trimmedSearchValue.length > MIN_USER_SEARCH_LENGTH) {
            set({ isSearching: true });
            get().actions.delayedSearch(trimmedSearchValue);
        }
    },
    delayedSearch: debounce(async (value: string) => {
        try {
            const { data } = await sidebarApi.search({ query: value, signal: get().abortController.signal });

            set({ globalResults: data });
        } catch (error) {
            console.error(error);
            set({ globalResults: null });
        } finally {
            set({ isSearching: false });
        }
    }, 500)
})