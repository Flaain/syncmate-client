import React from "react";

import { useLatest } from "./useLatest";

const ATTRIBUTE_NAME = 'data-virtual-index';

type Key = string | number;

/**
 * Properties for configuring a virtual list.
 */
interface UseVirtualListProps {
    /**
     * The total number of items in the list.
     */
    count: number;

    /**
     * The height of each item in the list. Can be a fixed number or a function
     * that returns the height for a specific item based on its index.
     */
    itemHeight?: ((index: number) => number) | number;

    /**
     * A function to estimate the height of an item based on its index.
     * Useful for optimizing rendering when item heights vary.
     */
    estimateItemHeight?: (index: number) => number;

    /**
     * A function that returns a unique key for each item based on its index.
     * This is used to track and identify items efficiently.
     */
    getItemKey: (index: number) => Key;

    /**
     * The number of extra items to render outside the visible area for smoother scrolling.
     * Defaults to a reasonable value if not provided.
     * 
     * @default 3
     */
    overscan?: number;

    /**
     * The delay in milliseconds before considering the user to have stopped scrolling.
     * This can be used to optimize rendering during fast scrolling.
     * 
     * @default 150
     */
    scrollingDelay?: number;

    /**
     * A function that returns the scrollable container element.
     * This is used to calculate the visible area of the list.
     */
    getScrollElement: () => HTMLElement | null;
}

interface DynamicSizeListItem {
    key: Key;
    index: number;
    offsetTop: number;
    height: number;
}

export const useVirtualList = ({ count, itemHeight, overscan = 3, scrollingDelay = 150, getItemKey, getScrollElement, estimateItemHeight }: UseVirtualListProps) => {
    if (!itemHeight && !estimateItemHeight) {
        throw new Error(`you must pass either "itemHeight" or "estimateItemHeight" prop`);
    }

    const [measurementCache, setMeasurementCache] = React.useState<Record<Key, number>>({});
    const [containerHeight, setContainerHeight] = React.useState(0);
    const [scrollTop, setScrollTop] = React.useState(0);
    const [isScrolling, setIsScrolling] = React.useState(false);

    React.useLayoutEffect(() => {
        const scrollElement = getScrollElement();

        if (!scrollElement) return;

        let timeoutId: number | null = null;

        const handleScroll = (event?: Event) => {
            setScrollTop(scrollElement.scrollTop);

            if (event) {
                setIsScrolling(true);

                typeof timeoutId === 'number' && clearTimeout(timeoutId);
    
                timeoutId = setTimeout(() => {
                    setIsScrolling(false);
                }, scrollingDelay);
            }
        }

        const resizeObserver = new ResizeObserver(([entry]) => {
            if (!entry) return;

            const height = entry.borderBoxSize[0]?.blockSize ?? entry.target.getBoundingClientRect().height;

            setContainerHeight(height);
        });

        resizeObserver.observe(scrollElement);

        handleScroll();

        scrollElement.addEventListener('scroll', handleScroll);

        return () => {
            typeof timeoutId === 'number' && clearTimeout(timeoutId);

            scrollElement.removeEventListener('scroll', handleScroll);

            resizeObserver.disconnect();
        };
    }, [getScrollElement]);

    const getItemHeight = React.useCallback((index: number) => itemHeight ? (typeof itemHeight === 'function' ? itemHeight(index) : itemHeight) : (measurementCache[getItemKey(index)] ?? estimateItemHeight!(index)), [measurementCache])
    
    const { virtualItems, startIndex, endIndex, totalHeight, allItems } = React.useMemo(() => {
        let startIndex = -1, endIndex = -1, totalHeight = 0;

        const items: DynamicSizeListItem[] = [];

        for (let index = 0; index < count; index += 1) {
            const item = { index, key: getItemKey(index), height: getItemHeight(index), offsetTop: totalHeight };

            items.push(item);
            
            totalHeight += item.height;

            startIndex === -1 && item.offsetTop + item.height > scrollTop && (startIndex = Math.max(0, index - overscan))

            endIndex === -1 && item.offsetTop + item.height >= scrollTop + containerHeight && (endIndex = Math.min(count - 1, index + overscan));
        }

        return {
            virtualItems: items.slice(startIndex, endIndex + 1),
            startIndex,
            endIndex,
            allItems: items,
            totalHeight
        };
    }, [getItemHeight, count, scrollTop, containerHeight]);

    const latestData = useLatest({
        measurementCache,
        getItemKey,
        allItems,
        getScrollElement,
        scrollTop
    });

    const measureElementInner = React.useCallback((element: Element | null, resizeObserver: ResizeObserver, entry?: ResizeObserverEntry) => {
        if (!element || !element.isConnected) {
            element && resizeObserver.unobserve(element);
            return;
        };

        const index = Number(element.getAttribute(ATTRIBUTE_NAME));

        if (Number.isNaN(index)) {
            console.error(`dynamic elements must have a valid ${ATTRIBUTE_NAME} attribute`);
            return;
        }

        const { measurementCache, getItemKey, getScrollElement, allItems, scrollTop } = latestData.current;

        const key = getItemKey(index);

        resizeObserver.observe(element);

        const height = entry?.borderBoxSize[0]?.blockSize ?? element.getBoundingClientRect().height;

        if (measurementCache[key] === height) return;

        const item = allItems[index];
        const delta = height - item.height;

        delta && scrollTop > item.offsetTop && getScrollElement()?.scrollBy(0, delta)

        setMeasurementCache((cache) => ({ ...cache, [key]: height }));
    }, []);

    const itemsResizeObserver = React.useMemo(() => {
        const ro = new ResizeObserver((entries) => entries.forEach((entry) => measureElementInner(entry.target, ro, entry)));
        
        return ro;
    }, [latestData]);

    const measureElement = React.useCallback((element: Element | null) => measureElementInner(element, itemsResizeObserver), [itemsResizeObserver]);

    return {
        virtualItems,
        totalHeight,
        startIndex,
        endIndex,
        isScrolling,
        allItems,
        measureElement
    };
}