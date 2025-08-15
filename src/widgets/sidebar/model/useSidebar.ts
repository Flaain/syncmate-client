import React from "react";

import { feedApi, GlobalResults } from "@/features/feed";

import { sessionApi, useSession } from "@/entities/session";

import { MIN_USER_SEARCH_LENGTH } from "@/shared/constants";
import { debounce } from "@/shared/lib/utils/debounce";

export const useSidebar = () => {
    const [value, setValue] = React.useState('');
    const [isSearching, setIsSearching] = React.useState(false);
    const [globalResults, setGlobalResults] = React.useState<GlobalResults | null>(null);

    const searchRef = React.useRef<HTMLInputElement>(null);
    const searchAbortController = React.useRef<AbortController>(new AbortController());

    const handleLogout = async () => {
        await sessionApi.logout();

        useSession.getState().actions.onSignout();
    };

    const resetSearch = () => {
        searchAbortController.current.abort('Search request was cancelled');
        searchAbortController.current = new AbortController();

        searchRef?.current?.focus();

        setValue('');
        setGlobalResults(null);
        setIsSearching(false);

        delayedSearch.clear();
    };

    const handleSearch = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        if (!value) return resetSearch();
        
        const trimmedSearchValue = value.trim();
        
        setValue(trimmedSearchValue);

        if (trimmedSearchValue.length > MIN_USER_SEARCH_LENGTH) {
            setIsSearching(true);
            delayedSearch(trimmedSearchValue);
        }
    }

    const delayedSearch = React.useCallback(debounce(async (value: string) => {
        try {
            const { data } = await feedApi.search({ query: value, signal: searchAbortController.current.signal });

            setGlobalResults(data);
        } catch (error) {
            console.error(error);
            setGlobalResults(null);
        } finally {
            setIsSearching(false);
        }
    }, 500), []);

    return {
        value,
        searchRef,
        isSearching,
        globalResults,
        handleLogout,
        handleSearch,
        resetSearch,
    }
}