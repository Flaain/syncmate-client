import { SidebarStore } from "./types";
import { sessionApi, useSession } from "@/entities/session";
import { debounce } from "@/shared/lib/utils/debounce";
import { MIN_USER_SEARCH_LENGTH } from "@/shared/constants";
import { SetStateInternal } from "@/shared/model/types";
import { sidebarApi } from "../api";
import { ApiException } from "@/shared/api/error";

export const sidebarActions = (set: SetStateInternal<SidebarStore>, get: () => SidebarStore): SidebarStore['actions'] => ({
    handleLogout: async () => {
        await sessionApi.logout();
        useSession.getState().actions.onSignout();
    },
    getFeed: async () => {
        try {
            const { data } = await sidebarApi.get();

            set({ localResults: data });
        } catch (error) {
            console.error(error);
            set({ localResultsError: error instanceof ApiException ? error.message : 'Failed to load feed' });
        }
    },
    resetSearch: () => {
        set({ searchValue: '', globalResults: null });
        get().searchRef?.current?.focus();
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
            const { data } = await sidebarApi.search({ query: value });

            set({ globalResults: { feed: data.items } });
        } catch (error) {
            console.error(error);
            set({ globalResults: null });
        } finally {
            set({ isSearching: false });
        }
    }, 500)
})