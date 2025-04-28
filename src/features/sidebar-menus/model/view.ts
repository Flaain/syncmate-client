import React from 'react';

import { SettingsMenuSkeleton } from '../ui/settings/Skeleton';

export const SettingsContent = React.lazy(() => import('../ui/settings/Content').then((module) => ({ default: module.SettingsContent })).catch(() => ({ default: SettingsMenuSkeleton })));