import React from 'react';

import { cn } from '../lib/utils/cn';
import { uuidv4 } from '../lib/utils/uuidv4';

import { Label } from './label';
import { Typography } from './Typography';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    ripple?: boolean;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(({ ripple, className, label, ...props }, ref) => {
    const [rippleElements, setRippleElements] = React.useState<Array<React.JSX.Element>>([]);

    const createRipple = ({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLLabelElement | HTMLInputElement, MouseEvent>) => { // TODO: create reusable
        const { width, height, left, top } = currentTarget.tagName === 'LABEL' ? currentTarget.getBoundingClientRect() : currentTarget.parentElement!.getBoundingClientRect();

        const d = Math.max(width, height);

        const x = clientX - left - d / 2;
        const y = clientY - top - d / 2;

        setRippleElements((prevState) => {
            const key = uuidv4();

            return [
                ...prevState,
                <span
                    key={key}
                    className='z-1 absolute rounded-[50%] animate-ripple !bg-ripple-color'
                    style={{ width: d, height: d, left: x, top: y }}
                    onAnimationEnd={() => setRippleElements((prevState) => prevState.filter((el) => el.key !== key))}
                ></span>
            ];
        })
    };

    const handleLabelMouseDown = (event: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
        ripple && createRipple(event);
    };
    
    const handleInputMouseDown = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        event.stopPropagation();

        ripple && createRipple(event);

        props.onMouseDown?.(event);
    };
    
    return (
        <Label onMouseDown={handleLabelMouseDown} className='min-h-12 relative overflow-hidden box-border flex items-center justify-start cursor-pointer gap-5 px-4 py-1 dark:hover:bg-primary-dark-50/30 rounded-[10px] transition-colors duration-200 ease-in-out'>
            <input
                {...props}
                type='radio'
                onMouseDown={handleInputMouseDown}
                className={cn(
                    'size-[22px] cursor-pointer appearance-none rounded-full border-2 dark:border-primary-gray dark:checked:border-primary-purple peer',
                    className
                )}
                ref={ref}
            />
            {ripple && rippleElements}
            <Typography className='transition-all duration-150 ease-in-out absolute size-3 scale-50 peer-checked:scale-100 dark:bg-primary-purple rounded-full opacity-0 peer-checked:opacity-100 top-1/2 -translate-y-1/2 ml-[5px]'></Typography>
            <Typography title={label} size='base'>
                {label}
            </Typography>
        </Label>
    );
});