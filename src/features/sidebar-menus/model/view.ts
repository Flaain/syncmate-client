import React from 'react';

import { DataStorageMenuSkeleton } from '../ui/data/Skeleton';
import { ProfileMenuSkeleton } from '../ui/profile/ProfileMenuSkeleton';
import { SettingsMenuSkeleton } from '../ui/settings/Skeleton';

export const SettingsContent = React.lazy(() => import('../ui/settings/Content').then((module) => ({ default: module.SettingsContent })).catch(() => ({ default: SettingsMenuSkeleton })));
export const ProfileContent = React.lazy(() => import('../ui/profile/Content').then((module) => ({ default: module.ProfileContent })).catch(() => ({ default: ProfileMenuSkeleton })));
export const DataStorageContent = React.lazy(() => import('../ui/data/Content').then((module) => ({ default: module.DataStorageMenuContent })).catch(() => ({ default: DataStorageMenuSkeleton })));