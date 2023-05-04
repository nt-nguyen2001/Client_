import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { General } from './Components/General';

import { IconDoubleArrowLeft } from '@Components/icons/ReactIcon/iconDoubleArrowLeft';
import { IconDoubleArrowRight } from '@Components/icons/iconDoubleArrowRight';
import { IconSecurity } from '@Components/icons/iconSecurity';
import { IconSettings } from '@Components/icons/iconSettings';
import { Security } from './Components/Security/Security';
import styles from './userSetting.module.scss';

type tabT = 'general' | 'security';

function UserSetting() {
  const router = useRouter();
  const [tab, setTab] = useState<tabT>((router.query.tab as tabT) || 'general');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 426);

  const handleOpenModal = (state: boolean) => () => {
    setIsOpenModal(state);
  };

  const handleTab = (type: tabT) => () => {
    setTab(type);
    if (type !== 'general') {
      router.replace({
        query: { tab: type },
      });
    } else {
      router.replace({
        query: '',
      });
    }
  };

  useEffect(() => {
    const resize = (e: Event) => {
      if (window.innerWidth <= 426) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <section className={clsx(styles['userSetting'])}>
      <section className={clsx(styles['wrapper'])}>
        {!isOpenModal ? (
          <IconDoubleArrowRight className={styles['icon_arrow']} onClick={handleOpenModal(true)} />
        ) : (
          <IconDoubleArrowLeft className={styles['icon_arrow']} onClick={handleOpenModal(false)} />
        )}
        <section
          className={clsx(styles['settings'])}
          style={{
            display: isOpenModal || !isMobile ? 'block' : 'none',
          }}
        >
          <h1 className="text-xl">Settings</h1>
          <div className="pt-10">
            <div
              className={clsx(styles['settings-icon'], {
                [styles['active']]: tab === 'general' ? true : false,
              })}
              onClick={handleTab('general')}
            >
              <IconSettings />
              <p>General</p>
            </div>
            <div
              className={clsx(styles['settings-icon'], {
                [styles['active']]: tab === 'security' ? true : false,
              })}
              onClick={handleTab('security')}
            >
              <IconSecurity className={styles['security']} />
              <p>Security</p>
            </div>
          </div>
        </section>
        {tab === 'general' ? <General /> : <Security />}
      </section>
    </section>
  );
}

export { UserSetting };
