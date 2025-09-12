import React from 'react';

import { StackableItem } from '@/shared/ui/StackableItem';

import { StackableContext } from './context';
import { StackableItemProps, StackableNodesRef } from './types';

const TRANSITION_DELAY = 300;

export const StackableProvider = React.memo(({ base }: { base: StackableItemProps }) => {
    const { 0: tabs, 1: setTabs } = React.useState<Map<string, StackableItemProps>>(new Map([[base.id, base]]));

    const historyTabIds = React.useRef<Array<string>>([base.id]);
    const nodesRef = React.useRef<Record<string, StackableNodesRef>>(null);
    const isClosing = React.useRef(false);

    const close = () => {
        if (isClosing.current) return;

        isClosing.current = true;

        const tabId = historyTabIds.current[historyTabIds.current.length - 1];
        const tab = nodesRef.current![tabId];
        const prevNode = tab.node.previousElementSibling;

        if (!prevNode) {
            console.warn('Missing previous node');
            return;
        }

        tab.openTimeoutId && (clearTimeout(tab.openTimeoutId), (tab.openTimeoutId = null));

        prevNode.classList.remove('hidden');
            
        setTimeout(() => {
            prevNode.classList.remove('-translate-x-24');
        }, 0) // if using rAF sometimes it doesn't work
        
        setClasses(tab.node, 'out');

        tab.isClosing = true;

        tab.closeTimeoutId = setTimeout(() => {
            setTabs((prevState) => {
                const newMap = new Map(prevState);
                
                prevState.get(tabId)?.onClose?.();
                
                newMap.delete(tabId);
                
                return newMap;
            });
            
            isClosing.current = false;
            
            historyTabIds.current = historyTabIds.current.filter((id) => id !== tabId);
            
            const { [tabId]: _, ...rest } = nodesRef.current!
            
            nodesRef.current = rest;
        }, TRANSITION_DELAY + 30);
    };

    const handleRef = (element: HTMLDivElement | null, id: string, index: number) => {
        if (!element) return;
        
        if (index !== 0 && !nodesRef.current?.[id]) { // prevent from animating base and old tabs
            element.classList.add('translate-x-full');
                
            requestAnimationFrame(() => {
                setClasses(element, 'in');
                addOpenTimeout(id);
            });
        }

        nodesRef.current = {
            ...nodesRef.current,
            [id]: {
                openTimeoutId: null,
                closeTimeoutId: null,
                ...nodesRef.current?.[id],
                node: element
            }
        };
    };

    const setClasses = (node: HTMLDivElement, action: 'in' | 'out') => {
        if (action === 'in') {
            node.classList.add('translate-x-0');
            node.classList.remove('translate-x-full');
        } else {
            node.classList.remove('translate-x-0');
            node.classList.add('translate-x-full');
        }
    }

    const addOpenTimeout = (tabId: string) => {
        const tab = nodesRef.current![tabId];

        tab.openTimeoutId = setTimeout(() => {
            tab.node.previousElementSibling?.classList.add('hidden');
            
            tab.openTimeoutId = null;
        }, TRANSITION_DELAY + 30);
    }

    const open = (newTab: StackableItemProps) => {
        const possibleTab = nodesRef.current?.[newTab.id];
        const currentTab = nodesRef.current?.[historyTabIds.current[historyTabIds.current.length - 1]];

        if (possibleTab) {
            if (possibleTab.isClosing) {
                possibleTab.closeTimeoutId && (clearTimeout(possibleTab.closeTimeoutId), (possibleTab.closeTimeoutId = null));

                possibleTab.isClosing = false;
                isClosing.current = false;
                
                possibleTab.node.previousElementSibling?.classList.add('-translate-x-24');
                
                setClasses(possibleTab.node, 'in');
                addOpenTimeout(newTab.id);
            }

            return;
        };

        if (currentTab?.isClosing) {
            const prevNode = currentTab.node.previousElementSibling;

            prevNode?.classList.remove('translate-x-0');
            prevNode?.classList.add('-translate-x-24');
        } else {
            currentTab?.node.classList.remove('translate-x-0');
            currentTab?.node.classList.add('-translate-x-24');
        }

        setTabs((prevState) => {
            const newMap = new Map(prevState);

            newMap.set(newTab.id, newTab);

            return newMap;
        });
        
        historyTabIds.current.push(newTab.id);
    }

    const closeAll = () => {};

    const getCurrentTabNode = () => {};

    const getTabNodeById = (id: string) => {};

    const value = React.useMemo(() => ({
        open,
        nodesRef,
        isClosing
    }), []);

    return (
        <StackableContext.Provider value={value}>
            {Array.from(tabs.values()).map(({ content, id, title, containerClassName, headerContent }, index, array) => (
                <StackableItem
                    key={id}
                    title={title}
                    headerContent={headerContent}
                    ref={(e) => handleRef(e, id, index)}
                    hasActiveMenu={id !== array[array.length - 1].id}
                    className={containerClassName}
                    onBack={index ? close : undefined}
                >
                    {content}
                </StackableItem>
            ))}
        </StackableContext.Provider>
    );
}, () => true);