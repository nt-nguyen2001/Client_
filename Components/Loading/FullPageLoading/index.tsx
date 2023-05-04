import { IconSoftLoading } from '@Components/icons/iconSoftLoading';
import { createPortal } from 'react-dom';
import styles from './fullPageLoading.module.scss';
const FullPageLoading = () => {
  return createPortal(
    <section className={styles['container']}>
      <IconSoftLoading width="60px" height="60px" />
      <p>Loading</p>
    </section>,
    document.querySelector('#fullPageLoading') as HTMLElement
  );
};
export { FullPageLoading };
