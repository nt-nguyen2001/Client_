import clsx from 'clsx';
import styles from '../callPage.module.scss';
import { memo } from 'react';
import { Peer } from '../types';

const VideoComponent = memo(function VideoComponent({ id, stream, isDirty }: Peer) {
  return (
    <div
      //   { [styles['full']]: othersPeer.length === 1 ? true : false }
      className={clsx(styles['others'])}
      key={Math.random()}
    >
      <video
        ref={(ref) => {
          if (ref) {
            ref.srcObject = stream;
          }
        }}
        playsInline
        autoPlay
      ></video>
    </div>
  );
});

export { VideoComponent };
