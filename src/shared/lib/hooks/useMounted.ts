import React from 'react';

export const useMounted = () => {
    const isMounted = React.useRef(false);

    React.useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    return isMounted.current;
};