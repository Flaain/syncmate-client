import React from 'react';
import { LayoutSheetSkeleton } from '../ui/Skeletons';

export const LayoutSheetView = React.lazy(() => import('@/widgets/LayoutSheet/ui/ui').then((module) => ({ default: module.LayoutSheet })).catch(() => ({ default: LayoutSheetSkeleton })));