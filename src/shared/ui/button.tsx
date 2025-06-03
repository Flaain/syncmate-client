import React, { JSX } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils/cn';

import { uuidv4 } from '../lib/utils/uuidv4';

const buttonVariants = cva(
    'inline-flex items-center justify-center relative overflow-hidden box-border outline-none text-sm font-medium focus-visible:!ring-1 whitespace-nowrap disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 transition-all duration-200 ease-in-out',
    {
        variants: {
            variant: {
                primary: 'hover:opacity-80 focus-visible:opacity-80',
                outline: '!border !border-solid !bg-opacity-0 hover:!bg-opacity-100',
                ghost: 'hover:!bg-opacity-30 !bg-opacity-0 focus-visible:!bg-opacity-20',
                link: 'hover:underline hover:underline-offset-2 hover:opacity-80',
            },
            intent: {
                primary: 'dark:bg-primary-white dark:text-primary-dark-200 dark:border-primary-white bg-primary-dark-200 text-primary-white dark:focus-visible:ring-primary-purple',
                secondary: 'dark:bg-primary-dark-50 dark:text-primary-white dark:focus-visible:ring-primary-gray',
                third: 'dark:bg-primary-purple dark:text-primary-white dark:border-primary-purple',
                destructive: 'dark:bg-primary-destructive dark:text-white dark:border-primary-destructive dark:focus-visible:ring-primary-destructive',
                commerce: 'dark:bg-primary-commerce dark:text-primary-white dark:border-primary-commerce'
            },
            size: {
                default: 'h-10 px-4 py-2 min-w-[80px] rounded-[10px]',
                sm: 'h-9 rounded-md px-3',
                md: 'w-24 h-10 rounded-[10px]',
                lg: 'h-10 py-2 px-8 min-w-[120px]',
                icon: 'size-10 rounded-full p-2',
                circle: 'size-14 rounded-full',
                text: 'p-0'
            }
        },
        compoundVariants: [
            {
                intent: 'primary',
                variant: 'outline',
                className: 'dark:text-primary-white dark:hover:text-primary-dark-200'
            },
            {
                intent: 'destructive',
                variant: 'ghost',
                className: 'dark:text-primary-destructive'
            },
            {
                intent: 'commerce',
                variant: 'ghost',
                className: 'dark:text-primary-commerce'
            },
            {
                intent: 'secondary',
                variant: 'ghost',
                className: 'dark:text-primary-gray'
            },
            {
                intent: 'primary',
                variant: 'ghost',
                className: 'dark:text-primary-white'
            },
            {
                intent: 'third',
                variant: 'ghost',
                className: 'dark:text-primary-purple'
            }
        ],
        defaultVariants: {
            variant: 'primary',
            size: 'default'
        }
    },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { 
    asChild?: boolean;
    ripple?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, ripple, variant, intent, size, asChild = false, ...props }, ref) => {
    const [rippleElements, setRippleElements] = React.useState<Array<JSX.Element>>([]);

    const Comp = asChild ? Slot : 'button';

    const createRipple = ({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { width, height, left, top } = currentTarget.getBoundingClientRect();

        const d = Math.max(width, height);

        const x = clientX - left - d / 2;
        const y = clientY - top - d / 2;

        setRippleElements((prevState) => {
            const key = uuidv4();

            return [
                ...prevState,
                <div
                    key={key}
                    className='z-1 absolute rounded-[50%] animate-ripple !bg-ripple-color'
                    style={{ width: d, height: d, left: x, top: y }}
                    onAnimationEnd={() => setRippleElements((prevState) => prevState.filter((el) => el.key !== key))}
                ></div>
            ];
        })
    }

    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        props.onMouseDown?.(event);

        ripple && createRipple(event);
    };

    return (
        <Comp className={cn(buttonVariants({ variant, intent, size, className }))} ref={ref} {...props} onMouseDown={handleMouseDown}>
            {props.children}
            {ripple && rippleElements}
        </Comp>
    );
});

Button.displayName = 'Button';

export { Button };