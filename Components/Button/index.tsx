import clsx from 'clsx';
import { forwardRef, HTMLAttributes, ReactNode, SVGProps } from 'react';
import styles from './button.module.scss';

interface Button extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  disabled?: boolean | undefined;
  className?: string;
  padding?: string;
  type?: 'primary' | 'secondary';
  leftIcon?: SVGProps<SVGSVGElement> & ReactNode;
  rightIcon?: SVGProps<SVGSVGElement> & ReactNode;
  hover?: boolean;
}
const Button = forwardRef<HTMLButtonElement, Button>(function Button(
  { children, disabled, className, hover, type = 'primary', padding = '16px', leftIcon, rightIcon, ...props },
  ref
) {
  if (disabled) {
    Object.keys(props).forEach((key) => {
      type TNewProps = Omit<Button, 'children'>;
      const newProps: TNewProps = props;
      if (key.startsWith('on') && typeof newProps[key as keyof TNewProps] === 'function')
        newProps[key as keyof TNewProps] = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
        };
    });
  }
  return (
    <button
      className={clsx(
        styles['wrapper'],
        {
          [styles[type]]: true,
          [styles['disabled']]: disabled,
          [styles['hover']]: hover,
        },
        className
      )}
      // style={{
      //   padding,
      // }}
      ref={ref}
      {...props}
    >
      {leftIcon && <span className={clsx('mr-2', styles['icon'])}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className={clsx('ml-2', styles['icon'])}>{rightIcon}</span>}
    </button>
  );
});

export default Button;
