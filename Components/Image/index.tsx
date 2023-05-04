import { IconCamera } from '@Components/icons/iconCamera';
import NextImage, { ImageProps } from 'next/image';
import { ChangeEventHandler, useRef } from 'react';
type Image = ImageProps & {
  change?: boolean;
  multiple?: boolean;
  children?: JSX.Element;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
};

export const Image = ({ change, children, multiple, disabled = false, onChange, ...props }: Image) => {
  const ref = useRef<HTMLInputElement>(null);
  if (change) {
    return (
      <>
        <input type="file" ref={ref} multiple={multiple} className="hidden" onChange={onChange} />
        <div
          onClick={() => {
            if (ref.current && !disabled) {
              ref.current.click();
            }
          }}
          className="flex items-center justify-center"
        >
          {(props.src && <NextImage {...props} />) || null}
          {children || null}
        </div>
      </>
    );
  }
  return <NextImage {...props} />;
};
