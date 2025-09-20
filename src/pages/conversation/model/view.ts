import { lazyWithRetries } from '@/shared/lib/utils/lazyWithRetries';

export const View = lazyWithRetries('Conversation', (() => import('../ui/ui').then((module) => ({ default: module.Conversation }))));