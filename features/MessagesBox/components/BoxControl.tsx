import { IconDotVertical } from '@Components/icons/iconDotVertical';
import DetectContext from '@Context/DetectElement.Context';
import { useConversation } from '@Hooks/conversations/useConversation';
import stylesCommon from '@styles/commonStyle.module.scss';
import { ConverSations } from '@Types/Conversations';
import decodeHtml from '@utils/decodeHTML';
import clsx from 'clsx';
import { useContext, useEffect, useRef, useState, memo } from 'react';
import styles from './box.module.scss';

const BoxControl = memo(function BoxControl({
  _textId,
  _idConversations,
}: Pick<ConverSations, '_textId' | '_idConversations'>) {
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const { element, handleSetElement } = useContext(DetectContext);
  const refMenu = useRef<HTMLDivElement | null>(null);
  const { handleDeleteMessages } = useConversation({ _idConversations, from: 'boxcontrol' });

  useEffect(() => {
    if (element) {
      if (refMenu.current && !element.contains(refMenu.current)) {
        setIsOpenedModal(false);
      }
    }
  }, [element, refMenu]);

  return (
    <div
      className={styles['item-control']}
      onClick={(e) => {
        e.stopPropagation();
        handleSetElement(e.currentTarget);
        setIsOpenedModal((prev) => !prev);
      }}
    >
      <IconDotVertical className={styles['icon']} />
      {isOpenedModal && (
        <div
          className={clsx(stylesCommon['modal'], stylesCommon['modal-second'], styles['modal'])}
          ref={refMenu}
        >
          <div
            className={clsx(stylesCommon['modal-item'])}
            onClick={() => {
              handleDeleteMessages({ _textId, _idConversations });
            }}
          >
            <p className="ml-2">Remove</p>
          </div>
        </div>
      )}
    </div>
  );
});

export { BoxControl };
