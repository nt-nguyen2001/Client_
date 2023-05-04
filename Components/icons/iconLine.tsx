import { FC, SVGProps } from 'react';

export const IconLine: FC<SVGProps<SVGSVGElement>> = ({ width = '18px', height = '18px', ...props }) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 1024 1024"
      width={width}
      height={height}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M904 476H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path>
    </svg>
  );
};
