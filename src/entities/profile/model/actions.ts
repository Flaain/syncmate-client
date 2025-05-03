import { useSession } from "@/entities/session";

import { toast } from "@/shared/lib/toast";
import { SetStateInternal } from "@/shared/model/types";

import { profileApi } from "../api";

import { imageValidators } from "./constants";
import { ProfileStore } from "./types";

export const profileActions = (set: SetStateInternal<ProfileStore>, get: () => ProfileStore): ProfileStore['actions'] => ({
    getProfile: async () => {
        try {
            const { data } = await profileApi.getProfile();

            set({ profile: data });

            useSession.getState().actions.onSignin(data._id);
        } catch (error) {
            console.error(error);
        } finally {
            useSession.setState({ isAuthInProgress: false });
        }
    },
    handleUploadAvatar: async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files?.length || get().isUploadingAvatar) return;

        try {
            set({ isUploadingAvatar: true });

            const file = event.target.files[0];
            const validator = imageValidators.find(({ isValid }) => !isValid(file));

            if (validator) return toast.error(validator.message);

            const form = new FormData();

            form.append('image', new Blob([file], { type: file.type }));

            const { data } = await profileApi.avatar(form);

            set((prevState) => ({ profile: { ...prevState.profile, avatar: data } }));
        } catch (error) {
            console.error(error);
            toast.error('Cannot upload image');

            event.target.value = ''; // reset value to prevent caching
        } finally {
            set({ isUploadingAvatar: false });
        }
    },
})