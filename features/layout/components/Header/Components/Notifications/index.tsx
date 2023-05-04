import DetectContext from '@Context/DetectElement.Context';
import clsx from 'clsx';
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useContext,
  useRef,
  useState,
  forwardRef,
  RefObject,
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  MutableRefObject,
} from 'react';
import styles from '../../header.module.scss';

interface NotificationsI {
  quantity: number;
  cb: () => void;
  icon: JSX.Element;
  ComponentContainer(props: { setIsOpen: Dispatch<SetStateAction<boolean>> }): JSX.Element;
}

export function Notifications({ quantity, cb, icon, ComponentContainer }: NotificationsI) {
  const [isOpen, setIsOpen] = useState(false);
  const { handleSetElement } = useContext(DetectContext);

  const handleShowMenu = (e: MouseEvent) => {
    e.stopPropagation();
    const target = e.currentTarget;
    handleSetElement(target as Node);

    if (cb) {
      cb();
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="ml-[10px]">
      <div
        className={clsx(styles['bell'], {
          [styles['announcement']]: quantity ? true : false,
        })}
        data-announcement_qty={quantity >= 99 ? 99 : quantity}
        onClick={handleShowMenu}
      >
        {icon}
      </div>
      {isOpen ? <ComponentContainer setIsOpen={setIsOpen} /> : null}
    </div>
  );
}
