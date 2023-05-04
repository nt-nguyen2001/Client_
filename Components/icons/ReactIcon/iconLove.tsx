import { FC, SVGProps } from 'react';

export const IconLove: FC<SVGProps<SVGSVGElement>> = ({ width = '100%', height = '100%', ...props }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" width={width} height={height}>
      <path fill="url(#love)" d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Z"></path>
      <path
        fill="#ffffff"
        d="M10.473 4C8.275 4 8 5.824 8 5.824S7.726 4 5.528 4c-2.114 0-2.73 2.222-2.472 3.41C3.736 10.55 8 12.75 8 12.75s4.265-2.2 4.945-5.34c.257-1.188-.36-3.41-2.472-3.41Z"
        className="colorfff svgShape"
      ></path>
      <defs>
        <linearGradient id="love" x1="8" x2="8" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff6680" className="stopColorFF6680 svgShape"></stop>
          <stop offset="1" stopColor="#e61739" className="stopColorE61739 svgShape"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
};
