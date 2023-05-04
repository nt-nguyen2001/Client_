import Button from '@Components/Button';
import { IconClose } from '@Components/icons/iconClose';
import { IconSoftLoading } from '@Components/icons/iconSoftLoading';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './alertModal.module.scss';

interface AlertModalI {
  selector: string;
  content: string;
  btnAccept?: string;
  btnCancel?: string;
  cbAccept: () => void;
  cbCancel: () => void;
}

const AlertModal = ({ selector, cbAccept, cbCancel, content, btnAccept, btnCancel }: AlertModalI) => {
  return createPortal(
    <section className={styles['portal']}>
      <section className={styles['wrapper']}>
        <p>{content}</p>
        <div className={styles['wrapper-btn']}>
          {btnCancel && (
            <Button type="secondary" className={styles['wrapper-btn_cancel']} hover onClick={cbCancel}>
              {btnCancel}
            </Button>
          )}
          {btnAccept && (
            <Button type="secondary" className={styles['wrapper-btn_accept']} hover onClick={cbAccept}>
              {btnAccept}
            </Button>
          )}
        </div>
      </section>
    </section>,
    document.querySelector(selector) as HTMLElement
  );
};

export { AlertModal };
