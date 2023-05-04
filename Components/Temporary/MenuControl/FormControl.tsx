import { IComment } from '@Types/Comments';
import CheckOverflow from '@utils/checkOverflow';
import clsx from 'clsx';
import { useContext, useEffect, useRef, useState } from 'react';
import { TemporaryContext } from '..';
import styles from '../commentItem.module.scss';

function FormControl({
  handleEdit,
  _commentId,
  _parentId,
}: { handleEdit: () => void } & Pick<IComment, '_commentId' | '_parentId'>) {
  const [overFlowing, setOverFlowing] = useState({ bottom: false, right: false });
  const refMenu = useRef<HTMLDivElement>(null);
  const { handleDeleteComment } = useContext(TemporaryContext);

  useEffect(() => {
    setOverFlowing(CheckOverflow(refMenu.current));
  }, []);

  return (
    <div
      className={clsx(styles['menuControl'], {
        [styles[overFlowing.bottom ? 'menuControl-top' : 'menuControl-bottom']]: true,
        [styles[overFlowing.right ? 'menuControl-right' : 'menuControl-left']]: true,
      })}
      ref={refMenu}
    >
      <p className={styles['menuControl-item']} onClick={() => handleEdit()}>
        Edit
      </p>
      <p
        className={styles['menuControl-item']}
        onClick={() => handleDeleteComment({ _commentId, _parentId })}
      >
        Delete
      </p>
    </div>
  );
}

export default FormControl;
