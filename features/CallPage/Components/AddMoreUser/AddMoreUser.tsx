import { IconUserGroup } from '@Components/icons/iconUserGroup';
import { CallPageContext } from '@features/CallPage';
import clsx from 'clsx';
import { useContext, useState } from 'react';
import styles from '../../callPage.module.scss';
import { ModalComp } from './ModalComp';
import { RtcSocket } from 'Service/rtc.service';

const AddMoreUsers = () => {
  const [isShowModal, setIsShowModal] = useState(false);
  const { roomId, typeDevice, instance } = useContext(CallPageContext);

  const handleModal = () => {
    setIsShowModal((prev) => !prev);
  };
  const handleMakeCall = (UIDs: string[]) => () => {
    instance?.addPeople({
      UIDs,
      cb() {
        UIDs.map((id) => {
          RtcSocket.makeRing({
            toUID: id,
            payload: { ...typeDevice, roomId },
            cbGetStateConnection: (err) => {
              if (err) {
                console.log('error when add people:::', err);
              }
            },
          });
        });
        handleModal();
      },
    });
  };
  return (
    <>
      <IconUserGroup className={clsx(styles['item'])} onClick={handleModal} />
      {isShowModal && <ModalComp handleModal={handleModal} handleMakeCall={handleMakeCall} />}
    </>
  );
};
export { AddMoreUsers };
