import React from 'react';

export const useLatest = <T>(value: T, deps?: React.DependencyList) => {
    const ref = React.useRef<T>(value);

    React.useInsertionEffect(() => { ref.current = value; }, deps);

    return ref;
};