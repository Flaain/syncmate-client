export function debounce<T extends (...args: any[]) => void>(callback: T, ms: number = 350) {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    function debounced<U>(this: U, ...args: Parameters<typeof callback>) {
        const ctx = this;

        typeof timeout === 'number' && clearTimeout(timeout);

        timeout = setTimeout(() => {
            timeout = null;

            callback.apply(ctx, args);
        }, ms);
    }

    debounced.clear = () => typeof timeout === 'number' && clearTimeout(timeout);

    return debounced;
}