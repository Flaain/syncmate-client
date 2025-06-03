import React, { useState, useEffect, useRef } from 'react';

interface IntersectingProps {
    /**
     * Whether the element should be visible initially or not.
     * Useful e.g. for always setting the first N items to visible.
     * Default: false
     */
    initialVisible?: boolean;
    /** An estimate of the element's height */
    defaultHeight?: number;
    /** How far outside the viewport in pixels should elements be considered visible?  */
    visibleOffset?: number;
    /** Should the element stay rendered after it becomes visible? */
    stayRendered?: boolean;
    root?: HTMLElement | null;
    /** E.g. 'span', 'tbody'. Default = 'div' */
    rootElement?: string;
    rootElementClass?: string;
    /** E.g. 'span', 'tr'. Default = 'div' */
    placeholderElement?: string;
    placeholderElementClass?: string;
    children: React.ReactNode;
}

export const Intersecting = ({
    initialVisible = false,
    defaultHeight = 300,
    visibleOffset = 1000,
    stayRendered = false,
    root = null,
    rootElement = 'div',
    rootElementClass = '',
    placeholderElement = 'div',
    placeholderElementClass = '',
    children
}: IntersectingProps) => {
    const [isVisible, setIsVisible] = useState<boolean>(initialVisible);

    const wasVisible = useRef<boolean>(initialVisible);
    const placeholderHeight = useRef<number>(defaultHeight);
    const intersectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!intersectionRef.current) return;

        const localRef = intersectionRef.current;

        let rafTimer: number | null;

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];

            if (!entry.isIntersecting) {
                rafTimer = requestAnimationFrame(() => {
                    placeholderHeight.current = localRef.offsetHeight;
                });
            }

            React.startTransition(() => setIsVisible(entry.isIntersecting));
        }, { root, rootMargin: `${visibleOffset}px 0px ${visibleOffset}px 0px` });

        observer.observe(localRef);

        return () => {
            rafTimer && cancelAnimationFrame(rafTimer);
            localRef && observer.disconnect();
        };
    }, []);

    useEffect(() => {
        isVisible && (wasVisible.current = true);
    }, [isVisible]);


    return React.createElement(
        rootElement,
        {
            ref: intersectionRef,
            className: rootElementClass
        },
        isVisible || (stayRendered && wasVisible.current) ? (
            <>{children}</>
        ) : (
            React.createElement(placeholderElement, {
                className: placeholderElementClass,
                style: { height: `${placeholderHeight.current}px` }
            })
        )
    );
};