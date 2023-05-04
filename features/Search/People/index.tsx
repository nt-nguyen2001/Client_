import Skeleton from '@Components/Skeleton';
import { useSearchPeople } from '@Hooks/useSearchPeople';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styles from './people.module.scss';
import defaultAvatar from '@public/images/defaultAvatar.png';
import Link from 'next/link';
import { FriendsButton } from '@Components/Button/friendsButton';
import clsx from 'clsx';

const PeoplePage = () => {
  const { data, isFetching, searchPeople } = useSearchPeople();
  const router = useRouter();
  const skeleton = [1, 2, 3, 4, 5];

  useEffect(() => {
    const userName = router.query?.q as string;
    if (userName) {
      searchPeople({ userName });
    }
  }, [router.query]);

  return (
    <main className={styles['main']}>
      <section className={styles['container']}>
        {isFetching
          ? skeleton.map((item, idx) => (
              <div className={styles['item']} key={idx}>
                <Skeleton type="img" width="40px" height="40px" />
                <Skeleton type="text" width="250px" height="20px" />
                <Skeleton type="default" width="100px" height="40px" className="rounded-md" />
              </div>
            ))
          : data?.map(({ _name, _userId, _userName, avatar, _status }) => (
              <div className={clsx(styles['item'], 'flex justify-between')} key={_userId}>
                <div className="flex items-center">
                  <Link href={`/${_userName}`}>
                    <a>
                      <Image
                        src={avatar || defaultAvatar}
                        alt=""
                        width="68px"
                        height="68px"
                        className={styles['img']}
                      />
                    </a>
                  </Link>
                  <Link href={`/${_userName}`}>
                    <a>
                      <p className={styles['name']}>{_name}</p>
                    </a>
                  </Link>
                </div>
                <div>
                  <FriendsButton
                    _name={_name}
                    _toUserName={_userName}
                    avatar={avatar || defaultAvatar}
                    toUID={_userId}
                  />
                </div>
                {/* <Skeleton type="default" width="100px" height="40px" className="rounded-md" /> */}
              </div>
            ))}
      </section>
    </main>
  );
};
export { PeoplePage };
