import { IconBars } from '@Components/icons/iconBars';
import DetectContext from '@Context/DetectElement.Context';
import { IComment } from '@Types/Comments';
import { useContext, useEffect, useRef, useState } from 'react';
import styles from '../commentItem.module.scss';
import FormControl from './FormControl';
interface Menu {
  handleEdit: () => void;
}
function MenuControl({
  handleEdit,
  _commentId,
  _parentId,
}: Menu & Pick<IComment, '_commentId' | '_parentId'>) {
  const [isOpen, setIsOpen] = useState(false);
  const { element, handleSetElement } = useContext(DetectContext);
  const refBars = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (element) {
      if (element === refBars.current || refBars.current?.contains(element)) {
        setIsOpen((prev) => !prev);
      } else {
        setIsOpen(false);
      }
    }
  }, [element]);

  return (
    <div className={styles['icon-wrapper']}>
      <div
        className={styles['iconBars']}
        style={{
          zIndex: '50',
        }}
        ref={refBars}
        onClick={(e) => {
          if (e.target === element) {
            handleSetElement();
          }
        }}
      >
        <IconBars />
      </div>
      {isOpen ? <FormControl handleEdit={handleEdit} _commentId={_commentId} _parentId={_parentId} /> : null}
    </div>
  );
}

export default MenuControl;
