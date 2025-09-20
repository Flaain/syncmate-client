import { ComponentType, lazy, LazyExoticComponent } from 'react';

export const lazyWithRetries = <T extends ComponentType<any>>(
    name: string,
    importer: () => Promise<{ default: T }>,
    retries = 5
): LazyExoticComponent<T> => {
    const retryImport = async () => {
        try {
            return await importer();
        } catch (error) {
            if (error instanceof Error) {
                for (let i = 0; i < retries; i += 1) {
                    await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** i));

                    const url = new URL(error.message.replace('Failed to fetch dynamically imported module: ', '').trim());

                    url.searchParams.set('t', `${+new Date()}`);

                    try {
                        const module = await import(url.href);

                        return { default: module[name] };
                    } catch (e) {
                        console.log('retrying import');
                    }
                }
            }

            throw error;
        }
    };

    return lazy(retryImport);
};