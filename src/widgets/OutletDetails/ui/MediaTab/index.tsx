import React from 'react';

export const MediaTab = () => {
    const [media, setMedia] = React.useState<string[]>([]);

    if (!media.length) return <div>no media here</div>;

    return null;
};