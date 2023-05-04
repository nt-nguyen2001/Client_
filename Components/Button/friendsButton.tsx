import { AcceptFriends, DeleteInvitation, GetFriendStatus, MakeFriend } from '@Apis/friends.api';
import { ActivityNotifications } from '@Class/Notifications/ActivityNotifications';
import { IconUnfriend } from '@Components/icons/ReactIcon/iconUnfriends';
import { IconAddFriend } from '@Components/icons/iconAddFriend';
import { IconLoading } from '@Components/icons/iconloading';
import { CONTACT } from '@Constant/Contact';
import { useMessageBoxesContextFunction } from '@Context/MessagesBox.Context';
import useAuthentication from '@Hooks/useAuthentication';
import { AnnouncementProps, TypeLink } from '@Types/Announcements';
import { FetchResponse } from '@Types/Comments';
import { AcceptedFriends, DeletedFriendsInvitation, GotFriends } from '@Types/Friends/friends.api.type';
import { FriendsI, FriendsStatus, OnlineStatus } from '@Types/Friends/index.type';
import defaultAvatar from '@public/images/defaultAvatar.png';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { queryClient } from 'pages/_app';
import { useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Button from '.';
import styles from './button.module.scss';
import { StaticImageData } from 'next/image';

type FriendsButtonT = {
  _name: string;
  avatar: string | StaticImageData;
  _toUserName: string;
  toUID: string;
};

const FriendsButton = ({ toUID, _name, _toUserName, avatar }: FriendsButtonT) => {
  const auth = useAuthentication({});
  const FRIENDSTATUS = 'friendStatus';
  const [isShowModal, setIsShowModal] = useState(false);
  const { handleAddBox } = useMessageBoxesContextFunction();
  //   const [friendStatus, setFriendStatus] = useState<GotFriends>();
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const isYou = auth.data?._userId === toUID;
  const { data, isFetching } = useQuery({
    queryKey: [FRIENDSTATUS, toUID],
    queryFn: async () => {
      const res = await GetFriendStatus({ _UID1: auth.data?._userId || '', _UID2: toUID });

      if (res.status !== 200) {
        throw new Error(res.message);
      }
      return {
        _createAt: res.payload?._createAt,
        _idFriends: res.payload?._idFriends,
        _status: res.payload?._status ?? -1,
      };
    },
    enabled: !isYou ? true : false,
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
          _fromUser: auth.data?._userId || '',
          _name: auth.data?._name || '',
          avatar: auth.data?.avatar || '',
          _idLink: auth.data?._userName || '',
          _idOther: props._idFriends,
          _toUserName: _toUserName,
          _type: 'sent you a friend request.',
          _typeLink: TypeLink.User,
          _userId: toUID,
          state: 0,
        };

        instance.create({ payload, toUserId: props._UID2 });

        const { _createAt, _idFriends, _status } = props;

        queryClient.setQueryData<GotFriends>([FRIENDSTATUS, toUID], {
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
      queryClient.setQueryData<GotFriends>([FRIENDSTATUS, toUID], (prev) => {
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
      queryClient.setQueryData<GotFriends>([FRIENDSTATUS, toUID], {
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
        _receivedUserId: toUID,
      });
    }
  };

  if (isYou) {
    return null;
  }
  if (isFetching) {
    return <div>Loading</div>;
  }

  if (!data) {
    return <div>Error</div>;
  }

  switch (FriendsStatus[data._status] as keyof typeof FriendsStatus) {
    case 'Pending':
      return (
        <Button
          className={clsx(styles['friendsBtn'])}
          hover={!MakeFriendMutation.isLoading}
          type="secondary"
          padding="0"
          onClick={handleDelete}
        >
          Cancel Request
        </Button>
      );
    case 'Friends':
      return (
        <div className="flex gap-4">
          <div className="relative">
            <Button
              className={clsx(styles['friendsBtn'], styles['friend'])}
              hover
              type="secondary"
              padding="0"
              onClick={() => {
                setIsShowModal((prev) => !prev);
              }}
            >
              Friends
            </Button>

            {isShowModal ? (
              <div className={clsx(styles['modal'])} ref={ref}>
                <div
                  className={clsx(styles['modal-item'])}
                  onClick={() => {
                    handleDelete();
                    setIsShowModal(false);
                  }}
                >
                  <IconUnfriend />
                  <p className="ml-2">Unfriend</p>
                </div>
              </div>
            ) : null}
          </div>
          <Button
            className={clsx(styles['friendsBtn'], styles['messages'])}
            hover
            type="secondary"
            padding="0"
            onClick={() => {
              if (data._status) {
                const res = queryClient.getQueryData<OnlineStatus[]>([CONTACT]);
                const user = res?.find((user) => user._userId === toUID);
                let isOnline = false;
                if (user) {
                  isOnline = true;
                }
                handleAddBox({
                  props: {
                    _idConversations: data?._idFriends || '',
                    _name: _name || '',
                    _state: isOnline,
                    _userId: toUID,
                    _userName: _toUserName,
                    avatar: avatar ?? defaultAvatar,
                    opened: true,
                  },
                });
              }
            }}
          >
            Messages
          </Button>
        </div>
      );
    case 'Confirm Request':
      return (
        <>
          <Button
            className={clsx(styles['friendsBtn'])}
            type="secondary"
            padding="0"
            hover
            onClick={() => {
              if (data?._idFriends) {
                AcceptFriendsMutation.mutate({ _createAt: new Date(), _idFriends: data?._idFriends });
              }
            }}
          >
            Confirm Request
          </Button>
          <Button
            className={clsx(styles['friendsBtn'], styles['delete'])}
            type="secondary"
            padding="0"
            hover
            onClick={handleDelete}
          >
            Delete Request
          </Button>
        </>
      );
    default:
      return (
        <Button
          disabled={MakeFriendMutation.isLoading}
          className={clsx(styles['friendsBtn'])}
          type="secondary"
          padding="0"
          hover={!MakeFriendMutation.isLoading}
          onClick={() => {
            if (toUID) {
              MakeFriendMutation.mutate({
                _createAt: new Date(),
                _status: FriendsStatus.Pending,
                _UID1: auth.data?._userId || '',
                _UID2: toUID,
              });
            }
          }}
        >
          {MakeFriendMutation.isLoading ? (
            <IconLoading width="24px" height="24px" className="mr-2 " />
          ) : (
            <IconAddFriend width="20px" className="mr-2" />
          )}
          Add Friend
        </Button>
      );
  }
};
export { FriendsButton };
