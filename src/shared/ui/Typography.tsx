import React from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '../lib/utils/cn';

export type TypographyVariant = 'primary' | 'secondary' | 'commerce' | 'error';
export type TypographySize = 'base' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
export type TypographyWeight = 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
export type TypographyAlign = 'left' | 'center' | 'right';

export interface TypingParticipant {
    _id: string;
    name: string;
}

export interface TypographyVariants {
    variant: Record<TypographyVariant, string>;
    size: Record<TypographySize, string>;
    weight: Record<TypographyWeight, string>;
}

export interface BaseTypographyProps {
    variant?: TypographyVariant;
    size?: TypographySize;
    weight?: TypographyWeight;
    align?: TypographyAlign;
}

export type PolymorphicRef<T extends React.ElementType> = React.Ref<T> | React.RefObject<T>;

export type PropsOf<T extends React.ElementType> = React.ComponentPropsWithRef<T>;

export type PolymorphicProps<T extends React.ElementType = React.ElementType, TProps = object> = {
    as?: T;
} & TProps &
    Omit<PropsOf<T>, keyof TProps | 'as' | 'ref'> & { ref?: PolymorphicRef<T> };

export type TypographyProps<T extends React.ElementType = 'span'> = PolymorphicProps<T, BaseTypographyProps>;

export type TypographyComponent = <T extends React.ElementType = 'span'>(
    props: PolymorphicProps<T, TypographyProps<T>>
) => React.ReactNode;

const typographyVariants = cva(undefined, {
    variants: {
        variant: {
            primary: 'dark:text-primary-white text-primary-dark-200',
            secondary: 'text-primary-gray',
            commerce: 'text-primary-commerce',
            error: 'text-primary-destructive'
        },
        size: {
            base: 'text-base',
            xs: 'text-xs',
            sm: 'text-sm',
            md: 'text-md',
            lg: 'text-lg max-lg:text-base',
            xl: 'text-xl max-lg:text-lg',
            '2xl': 'text-2xl max-lg:text-xl',
            '3xl': 'text-3xl max-lg:text-2xl',
            '4xl': 'text-4xl max-lg:text-3xl',
            '5xl': 'text-5xl max-lg:text-4xl max-md:text-3xl',
            '6xl': 'text-6xl max-lg:text-4xl max-md:text-3xl'
        },
        weight: {
            normal: 'font-normal',
            medium: 'font-medium',
            semibold: 'font-semibold',
            bold: 'font-bold',
            extrabold: 'font-extrabold'
        }
    },
    defaultVariants: {
        variant: 'primary',
        size: 'base',
        weight: 'normal'
    }
});

export const Typography: TypographyComponent = React.forwardRef(<T extends React.ElementType = 'span'>(props: TypographyProps<T>, ref: PolymorphicRef<T>) => {
        const { as, variant, size, children, weight, className, ...rest } = props;

        const Component = as ?? 'span';

        return (
            <Component ref={ref} className={cn(typographyVariants({ variant, size, weight, className }))} {...rest}>
                {children}
            </Component>
        );
    }
);