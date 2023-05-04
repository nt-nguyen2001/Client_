import { FC, SVGProps } from 'react';

export const IconLeftArrow: FC<SVGProps<SVGSVGElement>> = ({ width = '18px', height = '18px', ...props }) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      version="1.1"
      viewBox="0 0 17 17"
      strokeWidth="0"
      width={width}
      height={height}
      {...props}
    >
      <g></g>
      <path d="M10.854 4.854l-3.647 3.646 3.646 3.646-0.707 0.707-4.353-4.353 4.354-4.354 0.707 0.708zM17 8.5c0 4.687-3.813 8.5-8.5 8.5s-8.5-3.813-8.5-8.5 3.813-8.5 8.5-8.5 8.5 3.813 8.5 8.5zM16 8.5c0-4.136-3.364-7.5-7.5-7.5s-7.5 3.364-7.5 7.5 3.364 7.5 7.5 7.5 7.5-3.364 7.5-7.5z"></path>
    </svg>
  );
};
