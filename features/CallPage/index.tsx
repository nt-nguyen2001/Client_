import { getInfoUser } from '@Apis/user.api';
import Button from '@Components/Button';
import { AlertModal } from '@Components/Modal/AlertModal';
import { IconCallEnded } from '@Components/icons/iconCallEnded';
import { IconCameraVideo } from '@Components/icons/iconCameraVideo';
import { IconMicroPhone } from '@Components/icons/iconMicroPhone';
import { IconMutedCameraVideo } from '@Components/icons/iconMutedCameraVideo';
import { IconMutedMicroPhone } from '@Components/icons/iconMutedMicroPhone';
import { IconPhone } from '@Components/icons/iconPhone';
import { IconSoftLoading } from '@Components/icons/iconSoftLoading';
import useAuthentication from '@Hooks/useAuthentication';
import { User } from '@Types/User/User.type';
import defaultAvatar from '@public/images/defaultAvatar.png';
import facebook_ring from '@public/sounds/facebook_waiting.mp3';
import { RtcSocket } from 'Service/rtc.service';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState, createContext } from 'react';
import { VideoComponent } from './Components/VideoComponent';
import { YourVideoComp } from './Components/YourVideoComponent';
import styles from './callPage.module.scss';
import { RoomsCallSocket } from './services/roomsCall.socket';
import { Peer, typeRoomE } from './types';
import { AddMoreUsers } from './Components/AddMoreUser/AddMoreUser';

type CallPageContextT = {
  roomId: string;
  currentUsersInRoom: string[];
  typeDevice: { video: boolean; audio: boolean };
  instance: RoomsCallSocket | undefined;
};

const CallPageContext = createContext<CallPageContextT>({
  roomId: '',
  currentUsersInRoom: [],
  typeDevice: { audio: false, video: false },
  instance: undefined,
});
export { CallPageContext };

const CallPage = () => {
  const auth = useAuthentication({});
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<User>();
  const [isCalling, setIsCalling] = useState(true);
  const [devices, setDevices] = useState({
    audio: false,
    video: false,
  });
  const [instanceRtc, setInstanceRtc] = useState<RoomsCallSocket>();
  const [othersPeer, setOthersPeer] = useState<Peer[]>([]);
  const yourVideoEl = useRef<HTMLVideoElement | null>(null);
  const [isCallEnded, setIsCallEnded] = useState({
    state: false,
    content: '',
  });
  const ring = useMemo(() => new Audio(facebook_ring), []);
  const [isModal, setIsModal] = useState({ state: false, content: '' });
  const infoRoom = useRef<CallPageContextT>({
    roomId: '',
    currentUsersInRoom: [],
    typeDevice: { audio: false, video: false },
    instance: undefined,
  });
  // const roomIdRef = useRef<string>('');
  // const usersInRoom = useRef<string[]>([]);

  const handleEndCall = () => {
    try {
      window.close();
    } catch (e) {
      console.log(e);
    }
    instanceRtc?.disconnect();
    setIsCallEnded((prev) => ({ ...prev, state: true }));
  };
  const handleDevices = (type: 'audio' | 'video') => {
    setDevices((prev) => {
      instanceRtc?.mute({ type, enabled: !prev[type] });
      return { ...prev, [type]: !prev[type] };
    });
  };
  const handleRing = (state: boolean) => {
    ring.loop = true;
    state ? ring.play() : ring.pause();
  };
  useEffect(() => {
    if (auth.data?._userId && router.query?.roomId) {
      const rootEl = document.getElementById('userList');
      if (rootEl) {
        const audio = router.query.audio?.toString().toLocaleLowerCase() === 'true';
        const video = router.query.video?.toString().toLocaleLowerCase() === 'true';
        const typeRoom = router.query.typeCall as string;
        const roomId = router.query.roomId as string;
        infoRoom.current = {
          ...infoRoom.current,
          roomId: roomId,
          typeDevice: {
            audio,
            video,
          },
        };
        const uid = router.query.uid as string;
        const user_ring: string[] = [];
        setDevices({
          audio,
          video,
        });
        for (const key in router.query) {
          const regex = /user_ring/g;
          if (key.match(regex)) {
            user_ring.push(router.query[key] as string);
          }
        }
        const userId = user_ring.at(-1);
        if (userId) {
          getInfoUser({ _userId: userId }).then((res) => {
            if (res.status === 200) {
              setTimeout(() => {
                setUserInfo(res.payload?.[0]);
              }, 2000);
            }
          });
        }

        RoomsCallSocket.init<string>({
          UID: auth.data._userId,
          rootEl,
          typeMedia: { audio, video },
          receiveRemotePeer: ({ stream, id }) => {
            infoRoom.current = {
              ...infoRoom.current,
              currentUsersInRoom: [id, ...infoRoom.current.currentUsersInRoom],
            };
            setOthersPeer((prev) => {
              const index = prev.findIndex((peer) => peer.id === id);
              if (index !== -1) {
                prev[index] = { stream, id, isDirty: !prev[index].isDirty };
                return [...prev];
              } else {
                return [{ stream, id, isDirty: false }, ...prev];
              }
            });
          },
          cbPeerDisconnected: ({ id }) => {
            setOthersPeer((prev) => {
              if (prev.length <= 1) {
                setIsCallEnded({ state: true, content: 'The call was ended' });
                return [];
              }
              infoRoom.current = {
                ...infoRoom.current,
                currentUsersInRoom: [...infoRoom.current.currentUsersInRoom.filter((uid) => uid !== id)],
              };
              return prev.filter((peer) => peer.id !== id);
            });
          },
          onSettled(response) {
            setIsCalling(false);
          },
          onStateOfDevices: (e) => {
            if (e) {
              setIsModal({
                state: true,
                content: 'You have denied access to your devices',
              });
            }
          },
          yourEl: yourVideoEl.current!,
        })
          .then(({ instance }) => {
            instance.joinRoom({
              roomId,
              typeRoom: typeRoomE[Number(typeRoom)] as keyof typeof typeRoomE,
              usersInRoom: [...user_ring, uid],
              fnRing: ({ users, error }) => {
                if (error) {
                  console.log(error);
                  setIsCallEnded({
                    state: true,
                    content: error,
                  });
                  return;
                }
                users.forEach((user) => {
                  RtcSocket.makeRing({
                    toUID: user,
                    payload: { audio, video, roomId },
                    cbGetStateConnection: (err) => {
                      if (err) {
                        handleRing(false);
                        setIsCallEnded({ state: true, content: err.message });
                      }
                    },
                  });
                });
              },
            });
            infoRoom.current = {
              ...infoRoom.current,
              instance,
            };
            setInstanceRtc(instance);
          })
          .catch((err) => {
            console.log('ERROR:::', err);
            if (err) {
              setIsModal({
                state: true,
                content: 'You have denied access to your devices',
              });
            }
          });
      }
    }
  }, [auth.data?._userId, router.query]);

  useEffect(() => {
    if (isCalling) {
      handleRing(true);
    } else {
      handleRing(false);
    }
  }, [isCalling]);

  if (isCallEnded.state) {
    return (
      <div className={clsx(styles['wrapper'], 'flex items-center justify-center flex-col')}>
        {/* <div className={styles['iconEnded']}>
        </div> */}
        <IconCallEnded />
        <div className="absolute bottom-20 flex items-center justify-center flex-col">
          {isCallEnded.content && (
            <>
              <div className="mb-5">{isCallEnded.content}</div>
              <Button
                type="secondary"
                className={styles['ended_btn']}
                hover
                onClick={() => {
                  handleEndCall();
                }}
              >
                OK
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <CallPageContext.Provider value={{ ...infoRoom.current }}>
      <section className={styles['wrapper']}>
        <section className={styles['container']}>
          <section id="userList" className={styles['users']}>
            {othersPeer.map((peer) => (
              <VideoComponent {...peer} key={peer.id} />
            ))}
            <div id="you" className={styles['yourCamera']}>
              <YourVideoComp yourVideoEl={yourVideoEl} />
            </div>
          </section>
          <section className={styles['control']}>
            <AddMoreUsers />
            <div onClick={() => handleDevices('audio')} className={clsx(styles['inActive'], styles['item'])}>
              {devices.audio ? <IconMicroPhone /> : <IconMutedMicroPhone />}
            </div>
            <div onClick={() => handleDevices('video')} className={clsx(styles['active'], styles['item'])}>
              {devices.video ? <IconCameraVideo /> : <IconMutedCameraVideo />}
            </div>
            <IconPhone className={clsx(styles['end'], styles['item'])} onClick={handleEndCall} />
          </section>
          {isCalling && (
            <section className="flex items-center justify-center absolute bottom-1/2 translate-y-1/2  -translate-x-1/2 left-1/2 z-50">
              {!userInfo ? (
                <IconSoftLoading width="100px" height="100px" />
              ) : (
                <div className="flex items-center justify-center flex-col">
                  <Image
                    src={userInfo.avatar || defaultAvatar}
                    alt=""
                    width="120px"
                    height="120px"
                    className="rounded-full"
                    // layout="responsive"
                  />
                  <p className="text-2xl my-3">{userInfo._name}</p>
                  <p>Calling...</p>
                </div>
              )}
            </section>
          )}
        </section>
      </section>
      {isModal.state && (
        <AlertModal
          selector="#alertPortal"
          cbAccept={() => {
            setIsModal({
              state: false,
              content: '',
            });
          }}
          cbCancel={() => {}}
          content={isModal.content}
          btnAccept="OK"
        />
      )}
    </CallPageContext.Provider>
  );
};
export { CallPage };
