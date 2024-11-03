export enum PRESENCE {
    ONLINE = 'online',
    OFFLINE = 'offline'
}

export interface ProfileStore {
    profile: Profile;
    isUploadingAvatar: boolean;
    actions: {
        getProfile: () => Promise<void>;
        handleUploadAvatar: (event: React.ChangeEvent<HTMLInputElement>) => void;
        handleSetStatus: (status: string) => void;
    };
}

export interface Profile {
    _id: string;
    name: string;
    login: string;
    email: string;
    presence: PRESENCE;
    status?: string;
    avatar?: Avatar;
    lastSeenAt: string;
    isOfficial: boolean;
    isPrivate: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Avatar {
    _id: string;
    url: string;
}