import DetectContext from '@Context/DetectElement.Context';
import useAuthentication from '@Hooks/useAuthentication';
import defaultAvatar from '@public/images/defaultAvatar.png';
import Image from 'next/image';
import { useContext, useEffect, useRef, useState } from 'react';
import styles from './settings.module.scss';
import Link from 'next/link';
const Settings = () => {
  const auth = useAuthentication({});
  const [isShowModal, setIsShowModal] = useState(false);
  const { element, handleSetElement } = useContext(DetectContext);
  const refModal = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (refModal.current === element || refModal.current?.contains(element as Node)) {
      setIsShowModal((prev) => !prev);
      return;
    }
    setIsShowModal(false);
  }, [element]);

  return (
    <section
      className="relative"
      style={{
        width: '40px',
        height: '40px',
        marginLeft: '10px',
      }}
      ref={refModal}
      onClick={(e) => {
        if (e.target === element) {
          setIsShowModal((prev) => !prev);
        }
      }}
    >
      <Image
        src={auth.data?.avatar || defaultAvatar}
        width="100%"
        height="100%"
        className="rounded-full"
        alt=""
        layout="responsive"
      />
      {isShowModal && (
        <section className={styles['modal']}>
          <Link href={auth.data?._userName || '/'}>
            <a>
              <p className={styles['item']}>Profile</p>
            </a>
          </Link>
          <Link href="/Setting">
            <a>
              <p className={styles['item']}>Settings</p>
            </a>
          </Link>
          <p className={styles['item']}>Log out</p>
        </section>
      )}
    </section>
  );
};
export { Settings };
