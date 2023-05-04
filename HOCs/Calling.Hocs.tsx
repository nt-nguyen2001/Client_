import { getInfoUser } from '@Apis/user.api';
import { CallingModal } from '@Components/Modal/CallingModal';
import useAuthentication from '@Hooks/useAuthentication';
import { User } from '@Types/User/User.type';
import defaultAvatar from '@public/images/defaultAvatar.png';
import { RtcSocket } from 'Service/rtc.service';
import { useMemo, useState, useEffect } from 'react';
import facebook_ring from '@public/sounds/facebook_ring.mp3';

const CallingHoc = ({ children }: { children: JSX.Element }) => {
  const auth = useAuthentication({});
  const [isReceivedCalling, setIsReceivedCalling] = useState(false);
  const [fromUser, setFromUser] = useState<User>();
  const ring = useMemo(() => (typeof Audio !== 'undefined' ? new Audio(facebook_ring) : undefined), []);

  const instance = useMemo(() => {
    if (auth.data?._userId) {
      return RtcSocket.init({
        UID: auth.data._userId,
        onReceiveCalling: async (fromUID) => {
          const res = await getInfoUser({ _userId: fromUID });
          if (res.status !== 200) {
            return;
          }
          if (res.payload) {
            setFromUser(res.payload[0]);
            setIsReceivedCalling(true);
          }
        },
      });
    }
  }, [auth.data?._userId]);

  useEffect(() => {
    if (ring) {
      if (isReceivedCalling) {
        ring.loop = true;
        ring.play();
      } else {
        ring.pause();
      }
    }
  }, [isReceivedCalling, ring]);

  return (
    <>
      {isReceivedCalling && (
        <CallingModal
          avatar={fromUser?.avatar || defaultAvatar}
          cbAccept={() => {
            instance?.acceptCall();
            setIsReceivedCalling(false);
          }}
          cbReject={() => {
            instance?.rejectCall();
            setIsReceivedCalling(false);
          }}
          name={fromUser?._name || ''}
        />
      )}
      {children}
    </>
  );
};
export { CallingHoc };
