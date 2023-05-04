import decodeHtml from '@utils/decodeHTML';
import encodeHTMl from '@utils/escapeHtml';
import clsx from 'clsx';
import React, { forwardRef, MutableRefObject, ReactNode, SVGProps, useEffect, useRef, useState } from 'react';
import styles from '../input.module.scss';

export interface ITextInput extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
  className?: string;
  placeholder?: string;
  icon?: SVGProps<SVGSVGElement> & ReactNode;
  submit: (encodeContent: string) => void;
  handleChange?: (encodeContent: string) => void;
  reset?: boolean;
  content?: string;
  editable?: boolean;
}

export const TextInput = forwardRef<HTMLDivElement, ITextInput>(function SearchInput(
  { className, placeholder, icon, reset = true, content, editable = true, submit, handleChange, ...props },
  ref
) {
  const el = useRef(null);
  const refInp = useRef<HTMLDivElement>(null);
  const [element, setElement] = useState({
    width: 18,
    height: 18,
  });
  const EncodedContent = useRef<string | null>(null);
  useEffect(() => {
    if (el.current) {
      const El = el.current as HTMLSpanElement;
      setElement({
        height: El.offsetHeight,
        width: El.offsetWidth,
      });
    }
  }, []);
  useEffect(() => {
    if (ref) {
      (ref as MutableRefObject<HTMLDivElement | null>).current = refInp.current;
    }
  }, [refInp.current]);

  return (
    <div className="relative w-full h-full">
      {icon && (
        <span className={styles['icon']} ref={el}>
          {icon}
        </span>
      )}
      <div
        className={clsx(styles['input'], className)}
        contentEditable={editable}
        style={{
          paddingLeft: `${icon ? element.width * 2 + 'px' : '15px'}`,
        }}
        tabIndex={1}
        data-placeholder={placeholder}
        ref={refInp}
        onKeyUp={(e) => {
          const el = e.target as HTMLDivElement;
          const html = el.innerHTML || '';
          let content = el.textContent || '';
          const regex = /(?<=<\/span>).+/gm;
          const found = html.match(regex);

          if (found) {
            content = found[0];
          } else {
            content = html;
          }

          EncodedContent.current = content;
          if (handleChange) {
            handleChange(content);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            if (EncodedContent.current && decodeHtml(EncodedContent.current.trim() || '').trim()) {
              if (refInp?.current) {
                submit(encodeHTMl(EncodedContent.current));
                if (reset) {
                  refInp.current.textContent = null;
                }
                e.preventDefault();
              }
            } else {
              e.preventDefault();
            }
          }
        }}
        onPaste={(e) => {
          const target = e.target as HTMLDivElement;
          const text = e.clipboardData.getData('text/plain');
          target.innerText += text;

          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(target);
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);

          e.preventDefault();
        }}
        dangerouslySetInnerHTML={content ? { __html: decodeHtml(content) } : undefined}
        {...props}
      ></div>
    </div>
  );
});
