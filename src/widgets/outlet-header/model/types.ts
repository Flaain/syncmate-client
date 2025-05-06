import React from 'react';

export interface OutletHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
    name: string;
    avatar: React.ReactNode;
    description?: string;
    isOfficial?: boolean;
    dropdownContent?: React.ReactNode;
}