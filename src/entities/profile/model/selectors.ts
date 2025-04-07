import { ProfileStore } from "./types";

export const selectProfileName = (state: ProfileStore) => state.profile.name;