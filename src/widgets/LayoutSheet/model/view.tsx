import React from 'react';
import { LayoutSheetSkeleton } from '../ui/Skeletons/LayoutSheetSkeleton';

export const LayoutSheetView = React.lazy(() => import('@/widgets/LayoutSheet').then((module) => ({ default: module.LayoutSheet })).catch(() => ({ default: LayoutSheetSkeleton })));