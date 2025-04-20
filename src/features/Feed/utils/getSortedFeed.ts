import { LocalFeed } from "../model/types";

export const getSortedFeedByLastMessage = (a: LocalFeed, b: LocalFeed) => {
    return new Date(b.lastActionAt).getTime() - new Date(a.lastActionAt).getTime();
};