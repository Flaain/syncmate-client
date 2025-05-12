import { ProfileStore } from './types';

export const selectProfileName = (state: ProfileStore) => state.profile.name;

export const settingsSidebarMenuSelector = ({
    profile: { email, name, avatar, login, isOfficial },
    isUploadingAvatar,
    actions: { handleUploadAvatar }
}: ProfileStore) => ({
    email,
    name,
    avatar,
    login,
    isOfficial,
    isUploadingAvatar,
    handleUploadAvatar
});

export const sidebarDDMselector = (({ profile: { name, avatar, counts: { archived_chats } } }: ProfileStore) => ({ name, avatar, archived_chats }));