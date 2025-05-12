import React from 'react';

export const useLatest = <T>(value: T) => {
    const ref = React.useRef<T>(value);

    React.useInsertionEffect(() => { ref.current = value; });

    return ref;
};