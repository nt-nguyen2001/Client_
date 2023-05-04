import { FC, SVGProps } from 'react';

export const IconDoubleArrowLeft: FC<SVGProps<SVGSVGElement>> = ({
  width = '18px',
  height = '18px',
  ...props
}) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      width={width}
      height={height}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path d="M17.59 18L19 16.59 14.42 12 19 7.41 17.59 6l-6 6z"></path>
      <path d="M11 18l1.41-1.41L7.83 12l4.58-4.59L11 6l-6 6z"></path>
    </svg>
  );
};
