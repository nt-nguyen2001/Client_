import clsx from 'clsx';
import styles from './skeleton.module.scss';
import { HTMLAttributes } from 'react';

interface Skeleton extends HTMLAttributes<HTMLDivElement> {
  width: string;
  height: string;
  type: 'img' | 'text' | 'default';
  anim?: boolean;
}

function Skeleton({ width, height, type, className, anim = true, ...props }: Skeleton) {
  return (
    <div
      className={clsx(
        {
          [styles['skeleton_anim']]: anim,
          [styles['skeleton_notAnim']]: true,
        },
        styles[type],
        className
      )}
      {...props}
      style={{
        width,
        height,
      }}
    ></div>
  );
}

export default Skeleton;
