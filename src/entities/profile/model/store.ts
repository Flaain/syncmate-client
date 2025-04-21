import { create } from 'zustand';

import { profileActions } from './actions';
import { ProfileStore } from './types';

export const useProfile = create<ProfileStore>((set, get) => ({
    profile: null!,
    isUploadingAvatar: false,
    actions: profileActions(set, get)
}));