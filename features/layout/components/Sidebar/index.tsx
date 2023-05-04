import Link from 'next/link';
import { AiOutlineClose } from 'react-icons/ai';
import { Image } from '@Components/Image';
import Skeleton from '@Components/Skeleton';
import useAuthentication from '@Hooks/useAuthentication';
import clsx from 'clsx';
import { queryClient } from 'pages/_app';
import styles from './sideBar.module.scss';
import defaultAvatar from '@public/images/defaultAvatar.png';
import { LogOut } from '@Apis/authentication.api';
import { useState, useEffect } from 'react';
import { GetNumberOfPosts } from '@Apis/user.api';

function SideBar({ handleOpenBar, widthMobile }: { handleOpenBar?: () => void; widthMobile?: boolean }) {
  const { data, ...props } = useAuthentication({});
  const [subInfo, setSubInfo] = useState<{ posts: number }>();
  const handleLogOut = async () => {
    queryClient.setQueryData(['authentication'], {});
    LogOut();
  };
  useEffect(() => {
    GetNumberOfPosts({ _userId: data?._userId || '' }).then((res) => {
      setSubInfo({ posts: res.payload?.quantity || 0 });
    });
  }, []);
  return (
    <>
      <div className={styles['wrapper']}>
        {widthMobile && (
          <>
            <div className="flex justify-end p-4 text-lg">
              <AiOutlineClose onClick={handleOpenBar} />
            </div>
            {/* <div className="absolute top-0 z-[-1] w-screen h-full bg-slate-500"></div> */}
          </>
        )}
        <div className="py-8 pt-[56px]">
          <div className={styles['user']}>
            <div className={styles['info']}>
              <div className="mb-4">
                {!props.isLoading ? (
                  <Link href={`/${data?._userName}`} passHref>
                    <a>
                      <Image
                        src={data?.avatar || defaultAvatar}
                        alt=""
                        width="84px"
                        height="84px"
                        className="rounded-full"
                      />
                    </a>
                  </Link>
                ) : (
                  <Skeleton type="img" width="84px" height="84px" />
                )}
              </div>
              <p>{data?._name}</p>
            </div>
            <div className={styles['social']}>
              <div className={styles['social-item']}>
                <div className={styles['number']}>
                  {subInfo?.posts !== undefined ? (
                    subInfo.posts
                  ) : (
                    <Skeleton type="text" width="50px" height="20px" className="m-auto" />
                  )}
                </div>
                <p>POSTS</p>
              </div>
              {/* <div className={styles['social-item']}>
                <p className={styles['number']}>120</p>
                <p>FOLLOWERS</p>
              </div>
              <div className={styles['social-item']}>
                <p className={styles['number']}>120</p>
                <p>FOLLOWINGS</p>
              </div> */}
            </div>
          </div>
          <div className={styles['nav']}>
            <Link href="/Setting">
              <a className={styles['link']}>Setting</a>
            </Link>
            <div className={clsx(styles['link'], 'cursor-pointer')} onClick={() => handleLogOut()}>
              Log Out
            </div>
          </div>
        </div>
      </div>
      {widthMobile && <div id="modal-overlay" className="fixed top-0 w-screen h-screen bg-[#00000078]"></div>}
    </>
  );
}

export default SideBar;
