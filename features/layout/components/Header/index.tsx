import DetectContext from '@Context/DetectElement.Context';
import { useDebounce } from '@Hooks/useDebounce';
import { useSearchPeople } from '@Hooks/useSearchPeople';
import defaultAvatar from '@public/images/defaultAvatar.png';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import { AiFillHome } from 'react-icons/ai';
import { SearchInput } from '../../../../Components/Input/SearchInput';
import { IconFacebook } from '../../../../Components/icons/iconFacebook';
import { IconSearch } from '../../../../Components/icons/iconSearch';
import Announcement from './Components/Announcement';
import { MessagesNotifications } from './Components/MessagesNotifications';
import { Settings } from './Components/Settings';
import styles from './header.module.scss';

function Header() {
  const { debounce } = useDebounce();
  const { data, searchPeople } = useSearchPeople();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { element } = useContext(DetectContext);
  const containerParent = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFocus, setIsFocus] = useState<boolean>();

  useEffect(() => {
    if (window.innerWidth <= 426) {
      console.log('?');
      setIsMobile(true);
    }
    if (window.innerWidth <= 768) {
      setIsTablet(true);
    }
  }, []);

  useEffect(() => {
    const resize = (e: Event) => {
      const width = (e.target as Window).innerWidth;
      if (width <= 426) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
      if (width <= 768) {
        setIsTablet(true);
      } else {
        setIsTablet(false);
      }
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (
      element &&
      containerParent.current !== element &&
      !containerParent.current?.contains(element as Node)
    ) {
      setIsOpenModal(false);
      setIsFocus(false);
    }
  }, [element]);

  return (
    <>
      <section className={styles['wrapper']}>
        <div className={styles['colLeft']}>
          <div className="flex items-center flex-1">
            <Link href="/">
              <a>
                <IconFacebook className="flex-shrink-0 w-[44px] h-[44px]" />
              </a>
            </Link>
            <div className={styles['wrapper-input']} ref={containerParent}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <SearchInput
                  icon={<IconSearch width="18px" height="18px" />}
                  placeholder="Search"
                  className={styles['input']}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (e.currentTarget.value) {
                        router.push({ pathname: '/Search/People', query: { q: e.currentTarget.value } });
                      }
                    }
                  }}
                  onClick={() => {
                    setIsFocus(true);
                  }}
                  onChange={({ target: { value } }) => {
                    debounce(() => {
                      if (value) {
                        setIsOpenModal(true);
                        searchPeople({ userName: value });
                      }
                    }, 500);
                  }}
                />
              </form>
              {isOpenModal && (
                <div className={styles['search_table']}>
                  {data?.length ? (
                    data.map(({ _name, _userId, _userName, avatar }, idx) => (
                      <Link href={_userName} key={_userName}>
                        <a className={styles['item']}>
                          <Image
                            src={avatar ?? defaultAvatar}
                            alt=""
                            width="38px"
                            height="38px"
                            className={styles['img']}
                          />
                          <p className={styles['content']}>{_name}</p>
                        </a>
                      </Link>
                    ))
                  ) : (
                    <p>There were no results found.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {isMobile && isFocus ? null : (
          <div className={styles['colRight']}>
            <Link href="/">
              <a className={clsx(styles['icon'])}>
                <AiFillHome />
              </a>
            </Link>
            <MessagesNotifications />
            <Announcement />
            {isTablet && <Settings />}
          </div>
        )}
      </section>
    </>
  );
}

export default Header;
