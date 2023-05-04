import Button from '@Components/Button';
import { IconClose } from '@Components/icons/iconClose';
import { IconPhone } from '@Components/icons/iconPhone';
import clsx from 'clsx';
import Image, { StaticImageData } from 'next/image';
import styles from './callingModal.module.scss';

interface CallingModalI {
  avatar: string | StaticImageData;
  name: string;
  cbAccept: () => void;
  cbReject: () => void;
}

const CallingModal = ({ avatar, name, cbAccept, cbReject }: CallingModalI) => {
  return (
    <section className={styles['portal']}>
      <section className={styles['wrapper']}>
        <Image src={avatar} alt="" height="62px" width="62px" layout="fixed" className="rounded-full" />
        <p className={styles['modal_name']}>{name}</p>
        <span className={styles['modal_content']}>The call will start as soon as you accept</span>
        <div className={styles['btn_container']}>
          <Button type="secondary" className={styles['btn']} hover onClick={cbReject}>
            <IconClose className={clsx(styles['icon'], styles['icon_close'])} />
            <span className={styles['btn_content']}>Decline</span>
          </Button>
          <Button type="secondary" className={styles['btn']} hover onClick={cbAccept}>
            <IconPhone className={clsx(styles['icon'], styles['icon_accept'])} />
            <span className={styles['btn_content']}>Accept</span>
          </Button>
        </div>
      </section>
    </section>
  );
};
export { CallingModal };
