export function debounce<T extends (...args: any[]) => void>(callback: T, ms: number = 350, immediate = false) {
    let timeout: ReturnType<typeof setTimeout> | null;

    return function <U>(this: U, ...args: Parameters<typeof callback>) {
        const context = this, callNow = immediate && !timeout, later = () => {
            timeout = null;

            !immediate && callback.apply(context, args);
        };

        typeof timeout === 'number' && clearTimeout(timeout);

        timeout = setTimeout(later, ms);

        callNow && callback.apply(context, args);
    };
}