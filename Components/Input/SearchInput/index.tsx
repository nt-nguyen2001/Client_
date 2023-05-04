import clsx from 'clsx';
import React, {
  forwardRef,
  SVGProps,
  ReactNode,
  useRef,
  useEffect,
  useState,
  FormEventHandler,
  FormEvent,
  MutableRefObject,
} from 'react';
import styles from '../input.module.scss';

export interface IInput extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
  className?: string;
  placeholder?: string;
  icon?: SVGProps<SVGSVGElement> & ReactNode;

  // change: (data: string | null) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, IInput>(function SearchInput(
  { className, placeholder, icon, ...props },
  ref
) {
  const inputRef = useRef<HTMLInputElement | null>();
  const el = useRef(null);
  const [element, setElement] = useState({
    width: 18,
    height: 18,
  });
  // const
  useEffect(() => {
    if (el.current) {
      const El = el.current as HTMLSpanElement;
      setElement({
        height: El.offsetHeight,
        width: El.offsetWidth,
      });
    }
  }, []);

  return (
    <div className="relative w-[inherit]">
      {icon && (
        <span className={styles['icon']} ref={el}>
          {icon}
        </span>
      )}
      <input
        className={clsx(styles['input'], className)}
        style={{
          paddingLeft: `${icon ? element.width * 2 + 'px' : '15px'}`,
        }}
        placeholder={placeholder}
        ref={(target) => {
          inputRef.current = target;
          if (ref) {
            (ref as MutableRefObject<HTMLInputElement | null>).current = target;
          }
        }}
        {...props}
      ></input>
      {/* <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = inputRef?.current?.value;
          submit(data || null);
        }}
      >
      
      </form> */}
    </div>
  );
});
