import React from 'react';

export interface OutletHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
    name: string;
    description?: string;
    isOfficial?: boolean;
    dropdownMenu?: React.ReactNode;
}