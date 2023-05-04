import { RtcClass } from '@Class/RtcClass';
import { CallingModal } from '@Components/Modal/CallingModal';
import useAuthentication from '@Hooks/useAuthentication';
import { useEffect, useRef } from 'react';
import styles from './messages.module.scss';

const MessagesPage = () => {
  const auth = useAuthentication({});
  const instance = useRef<RtcClass>();
  useEffect(() => {
    // console.log('message', auth.data._userId);
    // instance.current = RtcClass.getInstance();
  }, [auth.data?._userId]);
  // useEffect(() => {
  //   if (auth.data._userId) {
  //     (async () => {
  //       // console.log(RtcClass.getInstance());
  //       // console.log('messages');
  //       const instance = await RtcClass.init({ _userId: auth.data._userId });
  //       instance.makeCall('b14e010e-c54e-41bd-bde0-76f9dbc90438');
  //     })();
  //   }

  //   // const
  // }, [auth.data._userId]);
  return (
    <section className={styles['container']}>
      <video id="remoteVideo" autoPlay></video>
      <video id="remoteVideo2" autoPlay></video>
      <div
      // onClick={() => {
      //   RtcClass.getInstance().makeCall('b14e010e-c54e-41bd-bde0-76f9dbc90438');
      //   // instance.makeCall('b14e010e-c54e-41bd-bde0-76f9dbc90438');
      // }}
      >
        Make Call
      </div>
    </section>
  );
};
export { MessagesPage };
