import { GetInfoFriends } from '@Apis/user.api';
import { GotInfoFriends } from '@Types/User/User.api';
import { User } from '@Types/User/User.type';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './friendsContainer.module.scss';
import Button from '@Components/Button';
import Skeleton from '@Components/Skeleton';
import clsx from 'clsx';
import defaultAvatar from '@public/images/defaultAvatar.png';
import Link from 'next/link';

const arr = [1, 1, 1, 1, 1, 1, 1, 1, 1];
const FriendsContainer = ({ _userId }: Pick<User, '_userId'>) => {
  const [friends, setFriends] = useState<GotInfoFriends>();
  useEffect(() => {
    if (_userId) {
      GetInfoFriends({ _userId }).then((res) => {
        if (res.status !== 200) {
          throw new Error(res.message);
        }
        setTimeout(() => {
          setFriends(res.payload);
        }, 1000);
      });
    }
    return () => {
      setFriends(undefined);
    };
  }, [_userId]);
  if (!friends) {
    return (
      <section>
        <div className="flex justify-between items-center">
          <Skeleton type="text" width="120px" height="20px" />
        </div>
        <section className={styles['friendsContainer']}>
          {arr.map((i, index) => (
            <section key={index} className={styles['item']}>
              <Skeleton type="text" className={styles['img']} width={`100%`} height="120px" />
            </section>
          ))}
        </section>
      </section>
    );
  }
  return (
    <section>
      <div className="flex justify-between items-center">
        <div>
          {/* <Upload /> */}
          <p className="font-semibold">Friends</p>
          <p className={styles['qty']}>{friends.quantity}</p>
        </div>
        <Button className={styles['btn_seeAll']} type="secondary" hover>
          See all friends
        </Button>
      </div>
      <section className={styles['friendsContainer']}>
        {friends.infoFriends.map((friend, index) => (
          <Link key={friend._userId} href={`/${friend._userName}`}>
            <a>
              <section className={styles['item']}>
                <div className={clsx(styles['img'], 'flex-1')}>
                  <Image
                    src={friend.avatar || defaultAvatar}
                    alt=""
                    width="100%"
                    height="100%"
                    layout="responsive"
                    className="rounded-md flex-1"
                  />
                </div>
                <p className={styles['name']}>{friend._name}</p>
              </section>
            </a>
          </Link>
        ))}
      </section>
    </section>
  );
};

export { FriendsContainer };
