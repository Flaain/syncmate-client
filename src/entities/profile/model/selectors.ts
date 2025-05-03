import { ProfileStore } from './types';

export const selectProfileName = (state: ProfileStore) => state.profile.name;

export const settingsSidebarMenuSelector = ({
    profile: { email, name, avatar, login },
    isUploadingAvatar,
    actions: { handleUploadAvatar }
}: ProfileStore) => ({
    email,
    name,
    avatar,
    login,
    isUploadingAvatar,
    handleUploadAvatar
});