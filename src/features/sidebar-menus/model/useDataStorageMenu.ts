import React from 'react';

import { useShallow } from 'zustand/shallow';

import { selectModalActions, useModal } from '@/shared/lib/providers/modal';
import { toast } from '@/shared/lib/toast';
import { getFileSize } from '@/shared/lib/utils/getFileSize';

export const useDataStorageMenu = () => {
    const [estimation, setEstimation] = React.useState<StorageEstimate | null>(null);
    
    const { onAsyncActionModal } = useModal(useShallow(selectModalActions));

    const quota = !estimation || !estimation.quota ? null : getFileSize(estimation.quota);
    const usage = !estimation || !estimation.usageDetails ? null : estimation.usageDetails.caches ? getFileSize(estimation.usageDetails.caches) : 0;

    const handleClearCache = React.useCallback(async () => {
       await onAsyncActionModal(async () => Promise.allSettled((await caches.keys()).map((key) => caches.delete(key))), {
            closeOnError: true,
            onResolve: () => toast.success(`${usage ?? 'Cache'} freed in your browser!`),
            onReject: () => toast.error('Failed to clear cache')
        });

        setEstimation((prevState) => ({ ...prevState, usageDetails: { caches: 0 } }));
    }, []);

    React.useEffect(() => {
        (async () => {
            try {
                if (!(navigator.storage && navigator.storage.estimate)) throw new Error('Cannot estimate. Missing storage in navigator');

                setEstimation(await navigator.storage.estimate());
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    return { handleClearCache, quota, usage };
};