import { lazyWithRetries } from '@/shared/lib/utils/lazyWithRetries';

export const View = lazyWithRetries('Auth', () => import('../ui/ui').then((module) => ({ default: module.Auth })));