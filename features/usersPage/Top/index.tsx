import { AcceptFriends, DeleteInvitation, GetFriendStatus, MakeFriend } from '@Apis/friends.api';
import { ActivityNotifications } from '@Class/Notifications/ActivityNotifications';
import { FriendsButton } from '@Components/Button/friendsButton';
import { Image } from '@Components/Image';
import Skeleton from '@Components/Skeleton';
import DetectContext from '@Context/DetectElement.Context';
import useAuthentication from '@Hooks/useAuthentication';
import { AnnouncementProps, TypeLink } from '@Types/Announcements';
import { FetchResponse } from '@Types/Comments';
import { AcceptedFriends, DeletedFriendsInvitation, GotFriends } from '@Types/Friends/friends.api.type';
import { FriendsI, FriendsStatus } from '@Types/Friends/index.type';
import { UserPage } from '@Types/User/User.type';
import defaultAvatar from '@public/images/defaultAvatar.png';
import { useMutation, useQuery } from '@tanstack/react-query';
import { extractColors } from 'extract-colors';
import { useRouter } from 'next/router';
import { queryClient } from 'pages/_app';
import { useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { LoadContainer } from '../LoadContainer';
import styles from '../usersPage.module.scss';
import stylesTop from './top.module.scss';

type files = {
  files: File[];
  type: 'avatar' | 'background_img';
};

const FRIENDSTATUS = 'friendStatus';

function TopPage({
  _name,
  avatar,
  background_img,
  disabled = true,
  _userId = '',
  _toUserName,
}: Partial<UserPage> & {
  disabled: boolean;
  _toUserName: string;
}) {
  const authentication = useAuthentication({});

  const router = useRouter();
  const isYou = authentication.data?._userName === router.query.userName;
  const [files, setFiles] = useState<files>({} as files);
  const [isShowModal, setIsShowModal] = useState(false);
  const { element, handleSetElement } = useContext(DetectContext);
  const [friendStatus, setFriendStatus] = useState<GotFriends>();

  const [bg, setBg] = useState<string[]>([]);
  useEffect(() => {
    if (background_img) {
      let src = background_img as string;
      if (typeof background_img === 'object') {
        src = background_img.src;
      }
      extractColors(src, { crossOrigin: 'anonymous', distance: 0.47 }).then((src) =>
        setBg(src.map((color) => color.hex))
      );
    }
  }, [background_img]);

  const handleUploadAvatar = (files: File[], type: 'avatar' | 'background_img') => {
    setFiles({
      files,
      type,
    });
  };

  useEffect(() => {
    if (authentication.data?._userId && _userId) {
      GetFriendStatus({ _UID1: authentication.data?._userId, _UID2: _userId }).then((res) => {
        if (res.status !== 200) {
          throw new Error(res.message);
        }
        setFriendStatus(res.payload);
      });
    }
  }, [authentication.data?._userId, _userId]);

  const { data } = useQuery({
    queryKey: [FRIENDSTATUS],
    queryFn: async () => {
      const res = await GetFriendStatus({ _UID1: authentication.data?._userId || '', _UID2: _userId });

      if (res.status !== 200) {
        throw new Error(res.message);
      }
      return {
        _createAt: res.payload?._createAt,
        _idFriends: res.payload?._idFriends,
        _status: res.payload?._status ?? -1,
      };
    },
    enabled: !isYou && _userId ? true : false,
  });

  const MakeFriendMutation = useMutation<FetchResponse<FriendsI>, unknown, Omit<FriendsI, '_idFriends'>>({
    mutationFn: (props) => {
      return MakeFriend(props);
    },
    onSuccess: (res) => {
      if (res.status !== 200) {
        // Need to handle this.
        throw new Error(res.message);
      }
      const instance = ActivityNotifications.getInstance();
      if (res.payload) {
        const props = res.payload;

        const payload: AnnouncementProps = {
          _createAt: new Date(),
          _idAnnouncement: uuid(),
          _fromUser: authentication.data?._userId || '',
          _name: authentication.data?._name || '',
          avatar: authentication.data?.avatar || '',
          _idLink: authentication.data?._userName || '',
          _idOther: props._idFriends,
          _toUserName: _toUserName,
          _type: 'sent you a friend request.',
          _typeLink: TypeLink.User,
          _userId,
          state: 0,
        };

        instance.create({ payload, toUserId: props._UID2 });

        const { _createAt, _idFriends, _status } = props;

        queryClient.setQueryData<GotFriends>([FRIENDSTATUS], {
          _createAt,
          _status,
          _idFriends,
        });
      }
    },
  });

  const AcceptFriendsMutation = useMutation<FetchResponse<AcceptedFriends>, unknown, AcceptedFriends>({
    mutationFn: (props) => {
      return AcceptFriends(props);
    },
    onSuccess: (res) => {
      if (res.status !== 200) {
        throw new Error(res.message);
      }
      queryClient.setQueryData<GotFriends>([FRIENDSTATUS], (prev) => {
        if (prev && res.payload?._createAt) {
          return {
            _createAt: res.payload._createAt,
            _idFriends: prev._idFriends,
            _status: FriendsStatus.Friends,
          };
        }
        return prev;
      });
    },
  });

  const DeleteInvitationMutation = useMutation<FetchResponse<unknown>, unknown, DeletedFriendsInvitation>({
    mutationFn: (props) => {
      queryClient.setQueryData<GotFriends>([FRIENDSTATUS], {
        _createAt: '',
        _status: FriendsStatus['Not Friends'],
        _idFriends: props._idFriends,
      });
      return DeleteInvitation(props);
    },
    onSuccess: (res) => {
      if (res.status !== 200) {
        // need to handle this.
        throw new Error(res.message);
      }
    },
  });

  const handleDelete = () => {
    if (data?._idFriends) {
      DeleteInvitationMutation.mutate({
        _idFriends: data._idFriends,
        _receivedUserId: _userId,
      });
    }
  };
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (element) {
      if (!(element === ref.current) && !ref.current?.contains(element)) {
        setIsShowModal(false);
      }
    }
  }, [element]);

  // function TypeButton(type: keyof typeof FriendsStatus) {
  //   switch (type) {
  //     case 'Pending':
  //       return (
  //         <Button
  //           className={clsx(styles['btn'])}
  //           hover={!MakeFriendMutation.isLoading}
  //           type="secondary"
  //           padding="0"
  //           onClick={handleDelete}
  //         >
  //           Cancel Request
  //         </Button>
  //       );
  //     case 'Friends':
  //       return (
  //         <div className="flex gap-4">
  //           <div className="relative">
  //             <Button
  //               className={clsx(styles['btn'], styles['friend'])}
  //               hover
  //               type="secondary"
  //               padding="0"
  //               onClick={() => {
  //                 setIsShowModal((prev) => !prev);
  //               }}
  //             >
  //               Friends
  //             </Button>

  //             {isShowModal ? (
  //               <div className={clsx(styles['modal'])} ref={ref}>
  //                 <div
  //                   className={clsx(styles['modal-item'])}
  //                   onClick={() => {
  //                     handleDelete();
  //                     setIsShowModal(false);
  //                   }}
  //                 >
  //                   <IconUnfriend />
  //                   <p className="ml-2">Unfriend</p>
  //                 </div>
  //               </div>
  //             ) : null}
  //           </div>
  //           <Button
  //             className={clsx(styles['btn'], styles['messages'])}
  //             hover
  //             type="secondary"
  //             padding="0"
  //             onClick={() => {
  //               if (friendStatus) {
  //                 const res = queryClient.getQueryData<OnlineStatus[]>([CONTACT]);
  //                 const user = res?.find((user) => user._userId === _userId);
  //                 let isOnline = false;
  //                 if (user) {
  //                   isOnline = true;
  //                 }
  //                 handleAddBox({
  //                   props: {
  //                     _idConversations: friendStatus._idFriends,
  //                     _name: _name || '',
  //                     _state: isOnline,
  //                     _userId,
  //                     _userName: _toUserName,
  //                     avatar: avatar ?? defaultAvatar,
  //                     opened: true,
  //                   },
  //                 });
  //               }
  //             }}
  //           >
  //             Messages
  //           </Button>
  //         </div>
  //       );
  //     case 'Confirm Request':
  //       return (
  //         <>
  //           <Button
  //             className={clsx(styles['btn'])}
  //             type="secondary"
  //             padding="0"
  //             hover
  //             onClick={() => {
  //               if (data?._idFriends) {
  //                 AcceptFriendsMutation.mutate({ _createAt: new Date(), _idFriends: data?._idFriends });
  //               }
  //             }}
  //           >
  //             Confirm Request
  //           </Button>
  //           <Button
  //             className={clsx(styles['btn'], styles['delete'])}
  //             type="secondary"
  //             padding="0"
  //             hover
  //             onClick={handleDelete}
  //           >
  //             Delete Request
  //           </Button>
  //         </>
  //       );
  //     default:
  //       return (
  //         <Button
  //           disabled={MakeFriendMutation.isLoading}
  //           className={clsx(styles['btn'])}
  //           type="secondary"
  //           padding="0"
  //           hover={!MakeFriendMutation.isLoading}
  //           onClick={() => {
  //             if (_userId) {
  //               MakeFriendMutation.mutate({
  //                 _createAt: new Date(),
  //                 _status: FriendsStatus.Pending,
  //                 _UID1: authentication.data?._userId || '',
  //                 _UID2: _userId,
  //               });
  //             }
  //           }}
  //         >
  //           {MakeFriendMutation.isLoading ? (
  //             <IconLoading width="24px" height="24px" className="mr-2 " />
  //           ) : (
  //             <IconAddFriend width="20px" className="mr-2" />
  //           )}
  //           Add Friend
  //         </Button>
  //       );
  //   }
  // }

  return (
    <>
      <LoadContainer files={files.files} type={files.type} />
      <div className={stylesTop['top']}>
        <div
          style={{
            background: `linear-gradient(${bg.join(',')})`,
          }}
        >
          <div className={styles['background']}>
            {background_img ? (
              <Image
                src={background_img}
                alt=""
                objectFit="fill"
                width="1280px"
                height="450px"
                disabled={disabled}
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  const files = target.files!;
                  handleUploadAvatar([files[0]], 'background_img');
                }}
                change
              />
            ) : (
              <Skeleton type="default" height="450px" width="1280px" />
            )}
          </div>
        </div>
        <div className={styles['wrapper-avatar']}>
          <div className={stylesTop['avatar']}>
            {avatar ? (
              <Image
                src={avatar}
                alt=""
                className="rounded-full"
                layout="fill"
                height="100%"
                width="100%"
                disabled={disabled}
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  const files = target.files!;
                  handleUploadAvatar([files[0]], 'avatar');
                }}
                change
              />
            ) : (
              <Skeleton type="img" height="150px" width="150px" />
            )}
          </div>
          <div>
            {/* TypeButton(FriendsStatus[data._status] as keyof typeof FriendsStatus) */}
            <div className={stylesTop['container_friends']}>
              {!isYou && data?._status ? (
                <FriendsButton
                  _name={_name || ''}
                  _toUserName={_toUserName}
                  avatar={avatar || defaultAvatar}
                  toUID={_userId}
                />
              ) : // TypeButton(FriendsStatus[data._status] as keyof typeof FriendsStatus)
              null}
            </div>
            <p className={styles['name']}>{_name}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default TopPage;
