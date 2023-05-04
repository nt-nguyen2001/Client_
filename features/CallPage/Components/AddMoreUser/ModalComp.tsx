import { GetInfoFriends } from '@Apis/user.api';
import Button from '@Components/Button';
import { IconClose } from '@Components/icons/iconClose';
import useAuthentication from '@Hooks/useAuthentication';
import { FriendsI } from '@Types/Friends/index.type';
import { User } from '@Types/User/User.type';
import defaultAvatar from '@public/images/defaultAvatar.png';
import Image from 'next/image';
import { useEffect, useState, useContext } from 'react';
import { createPortal } from 'react-dom';
import styles from './modalComp.module.scss';
import { CallPageContext } from '@features/CallPage';

const ModalComp = ({
  handleModal,
  handleMakeCall,
}: {
  handleModal: () => void;
  handleMakeCall: (UIDs: string[]) => () => void;
}) => {
  const auth = useAuthentication({});
  const { currentUsersInRoom } = useContext(CallPageContext);

  const [users, setUsers] = useState<
    (Pick<FriendsI, '_idFriends' | '_createAt' | '_status'> &
      Pick<User, 'avatar' | '_userId' | '_userName' | '_name'>)[]
  >([]);
  const [modalEl, setModalEl] = useState<HTMLDivElement>();
  const [usersAdded, setUsersAdded] = useState<
    (Pick<FriendsI, '_idFriends' | '_createAt' | '_status'> &
      Pick<User, 'avatar' | '_userId' | '_userName' | '_name'>)[]
  >([]);

  useEffect(() => {
    const modalEl = document.createElement('div');
    document.body.append(modalEl);
    setModalEl(modalEl);
    return () => modalEl.remove();
  }, []);
  const arr = [1, 2, 3, 4, 5];

  useEffect(() => {
    if (auth.data?._userId) {
      GetInfoFriends({ _userId: auth.data._userId }).then((res) => {
        if (res.status !== 200) {
          throw new Error(res.message);
        }
        if (res.payload?.infoFriends) {
          setUsers(res.payload.infoFriends);
        }
      });
    }
  }, [auth.data?._userId]);
  if (!modalEl) {
    return null;
  }

  const handleAddPeople =
    (
      people: Pick<FriendsI, '_idFriends' | '_createAt' | '_status'> &
        Pick<User, 'avatar' | '_userId' | '_userName' | '_name'>
    ) =>
    () => {
      setUsersAdded((prev) => {
        const user = prev.find(({ _userId }) => _userId === people._userId);
        if (user) {
          return prev;
        }
        return [people, ...prev];
      });
    };

  const handleRemovePeople =
    ({ UID }: { UID: string }) =>
    () => {
      setUsersAdded((prev) => {
        return prev.filter(({ _userId }) => _userId !== UID);
      });
    };

  return createPortal(
    <section className={styles['main']}>
      <div className="flex items-center justify-between">
        <p className="text-center flex-1">Add people</p>
        <IconClose className={styles['close']} onClick={handleModal} />
      </div>
      <div className={styles['container_usersAdded']}>
        {usersAdded.map(({ _name, _userId }) => (
          <div className={styles['item_usersAdded']} key={_userId}>
            <p>{_name}</p>
            <IconClose className={styles['icon_close']} onClick={handleRemovePeople({ UID: _userId })} />
          </div>
        ))}
      </div>
      <p className="mb-5">your friends:</p>
      <div className={styles['container']}>
        {users.map(({ avatar, _userId, _name, ...props }) => {
          const user = currentUsersInRoom.find((u) => u === _userId);
          if (user) {
            return null;
          }
          return (
            <div
              className={styles['item']}
              key={_userId}
              onClick={handleAddPeople({ avatar, _userId, _name, ...props })}
            >
              <div className={styles['img']}>
                <Image src={avatar || defaultAvatar} width="100%" height="100%" alt="" layout="responsive" />
              </div>
              <p>{_name}</p>
            </div>
          );
        })}
      </div>
      <Button
        className={styles['btn']}
        hover={usersAdded.length !== 0 ? true : false}
        type="secondary"
        disabled={usersAdded.length !== 0 ? false : true}
        onClick={handleMakeCall(usersAdded.map(({ _userId }) => _userId))}
      >
        Done
      </Button>
    </section>,
    modalEl as HTMLElement
  );
};
export { ModalComp };
