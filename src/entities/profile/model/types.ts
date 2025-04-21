import { Avatar, PRESENCE, Profile } from "@/shared/model/types";

export interface ProfileStore {
    profile: Profile;
    isUploadingAvatar: boolean;
    actions: {
        getProfile: () => Promise<void>;
        handleUploadAvatar: (event: React.ChangeEvent<HTMLInputElement>) => void;
        handleSetStatus: (status: string) => void;
    };
}

export interface SearchUser {
    _id: string;
    name: string;
    isOfficial: boolean;
    avatar?: Avatar;
    presence: PRESENCE;
    login: string;
}