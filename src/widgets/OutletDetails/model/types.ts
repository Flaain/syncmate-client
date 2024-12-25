import { OutletDetailsTypes } from "@/shared/model/types";

export enum DETAILS_TABS {
    MEMBERS = 'members',
    MEDIA = 'media',
    FILES = 'files',
    MUSIC = 'music',
    VOICE = 'voice'
}

export interface OutletDetailsProps {
    name: string;
    title: string;
    description?: string;
    avatarUrl?: string;
    info?: Array<{ data?: string; type: OutletDetailsTypes }>;
    tabs?: Array<DETAILS_TABS>;
}