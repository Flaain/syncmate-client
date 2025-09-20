import React from 'react';

import { StackableItem } from '@/shared/ui/StackableItem';

import { cn } from '../../utils/cn';

import { StackableContext } from './context';
import { StackableItemProps, StackableNodesRef } from './types';

const TRANSITION_DELAY = 300;

interface StackableConfig {
    historyTabIds: Array<string>;
    nodes: Record<string, StackableNodesRef> | null;
    isClosing: boolean;
    isClosingAll: boolean;
    containerNode: HTMLDivElement | null;
}

export const StackableProvider = React.memo(({ base, containerClassName, children }: { base: Omit<StackableItemProps, 'onClose'>, containerClassName?: string; children?: React.ReactNode }) => {
    const { 0: tabs, 1: setTabs } = React.useState<Map<string, StackableItemProps>>(new Map([[base.id, base]]));

    const config = React.useRef<StackableConfig>({
        historyTabIds: [base.id],
        nodes: null,
        isClosing: false,
        isClosingAll: false,
        containerNode: null
    })

    const close = () => {
        if (config.current.isClosing || config.current.isClosingAll) return;

        config.current.isClosing = true;

        const tabId = getCurrentTabId();
        const tab = config.current.nodes?.[tabId];

        if (!tab) {
            console.warn('Cannot process closing. Current tab not found');
            return;
        }

        const prevNode = tab.node.previousElementSibling;

        if (!prevNode) {
            console.warn('Cannot process closing. Missing previous node');
            return;
        }

        tab.openTimeoutId && (clearTimeout(tab.openTimeoutId), (tab.openTimeoutId = null));

        prevNode.classList.remove('hidden');
            
        setTimeout(() => {
            prevNode.classList.remove('-translate-x-24');
        }, 0) // if using rAF sometimes it doesn't work
        
        setTabClasses(tab.node, 'out');

        tab.isClosing = true;

        tab.closeTimeoutId = setTimeout(removeTabAfterTimeout, TRANSITION_DELAY + 30, tabId);
    };

    const handleTabRef = (element: HTMLDivElement | null, id: string, index: number) => {
        if (!element) return;
        
        if (index !== 0 && !config.current.nodes?.[id]) { // prevent from animating base and old tabs
            element.classList.add('translate-x-full');
                
            requestAnimationFrame(() => {
                setTabClasses(element, 'in');
                addOpenTimeout(id);
            });
        }

        config.current.nodes = {
            ...config.current.nodes,
            [id]: {
                openTimeoutId: null,
                closeTimeoutId: null,
                ...config.current.nodes?.[id],
                node: element
            }
        };
    };

    const setTabClasses = (node: HTMLDivElement, action: 'in' | 'out') => {
        if (action === 'in') {
            node.classList.add('translate-x-0');
            node.classList.remove('translate-x-full');
        } else {
            node.classList.remove('translate-x-0');
            node.classList.add('translate-x-full');
        }
    }

    const setContainerNode = (node: HTMLDivElement | null) => {
        config.current.containerNode = node;
    }

    const addOpenTimeout = (tabId: string) => {
        const tab = config.current.nodes![tabId];

        tab.openTimeoutId = setTimeout(() => {
            tab.node.previousElementSibling?.classList.add('hidden');
            
            tab.openTimeoutId = null;
        }, TRANSITION_DELAY + 30);
    }

    const open = (newTab: StackableItemProps) => {
        if (config.current.isClosingAll) return;

        const possibleTab = config.current.nodes?.[newTab.id];
        const currentTab = config.current.nodes?.[getCurrentTabId()];

        if (possibleTab) {
            if (possibleTab.isClosing) {
                possibleTab.closeTimeoutId && (clearTimeout(possibleTab.closeTimeoutId), (possibleTab.closeTimeoutId = null));

                possibleTab.isClosing = false;
                config.current.isClosing = false;
                
                possibleTab.node.previousElementSibling?.classList.add('-translate-x-24');
                
                setTabClasses(possibleTab.node, 'in');
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
        
        config.current.historyTabIds.push(newTab.id);
    }

    const removeTabAfterTimeout = (tabId: string) => {
        setTabs((prevState) => {
            const newMap = new Map(prevState);
            
            prevState.get(tabId)?.onClose?.();
            
            newMap.delete(tabId);
            
            return newMap;
        });
        
        config.current.isClosing = false;
        
        config.current.historyTabIds = config.current.historyTabIds.filter((id) => id !== tabId);
        
        const { [tabId]: _, ...rest } = config.current.nodes!
        
        config.current.nodes = rest;
    }

    const closeAll = () => {
        if (config.current.isClosingAll) return;

        config.current.isClosingAll = true;

        const tab = config.current.nodes?.[getCurrentTabId()];

        if (!tab) {
            console.warn('Cannot process closing. Current tab not found');
            return;
        }

        tab.openTimeoutId && (clearTimeout(tab.openTimeoutId), (tab.openTimeoutId = null));

        const baseNode = config.current.nodes?.[base.id]?.node;

        if (!baseNode) {
            console.warn('Cannot process closing. Missing base node');
            return;
        }

        baseNode.classList.remove('hidden');

        setTimeout(() => {
            baseNode.classList.remove('-translate-x-24');
        }, 0);

        setTabClasses(tab.node, 'out');

        tab.isClosing = true;

        tab.closeTimeoutId = setTimeout(() => {
            setTabs((prevState) => {
                const values = Array.from(prevState.values());
    
                values.forEach(({ onClose }) => onClose?.());
    
                const newMap = new Map([[base.id, base]]);
    
                return newMap;
            });

            const { [base.id]: baseRef } = config.current.nodes!

            config.current.isClosingAll = false;
            config.current.historyTabIds = [base.id];
            config.current.nodes = { [base.id]: baseRef };
        }, TRANSITION_DELAY + 30);
    };

    const getCurrentTabId = () => config.current.historyTabIds[config.current.historyTabIds.length - 1];

    const value = React.useMemo(() => ({
        open,
        closeAll,
    }), []);

    return (
        <StackableContext.Provider value={value}>
            <div ref={setContainerNode} className={cn('grid grid-cols-1 overflow-hidden size-full', containerClassName)}>
                {Array.from(tabs.values()).map(({ content, id, title, containerClassName, headerContent }, index, array) => (
                    <StackableItem
                        key={id}
                        title={title}
                        headerContent={headerContent}
                        ref={(e) => handleTabRef(e, id, index)}
                        hasActiveMenu={id !== array[array.length - 1].id}
                        className={containerClassName}
                        onBack={index ? close : undefined}
                    >
                        {content}
                    </StackableItem>
                ))}
            </div>
            {children}
        </StackableContext.Provider>
    );
}, () => true);