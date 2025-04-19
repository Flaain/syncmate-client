import { GlobalFeed, LocalFeed } from "@/widgets/Sidebar/model/types";

import { FeedTypes, GlobalFiltersType, LocalFiltersType } from "../model/types";

const localFilters: LocalFiltersType = {
    Conversation: ({ item: { recipient: { name, login } } }, value) => {
        return name.toLowerCase().includes(value) || login.toLowerCase().includes(value);
    }
};

const globalFilters: GlobalFiltersType = {
    User: ({ _id }, localResults) => localResults.some(({ type, item }) => type === FeedTypes.CONVERSATION && item.recipient._id === _id)
};

export const getFilteredLocalResults = (item: LocalFeed, value: string) => {
    switch (item.type) {
        case FeedTypes.CONVERSATION:
            return localFilters.Conversation(item, value);
        default:
            return false;
    }
}

export const getFilteredGlobalResults = (item: GlobalFeed, localResults: Array<LocalFeed>) => globalFilters[item.type](item, localResults);