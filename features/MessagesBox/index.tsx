import { IconClose } from '@Components/icons/iconClose';
import { useMessageBoxesContext, useMessageBoxesContextFunction } from '@Context/MessagesBox.Context';
import clsx from 'clsx';
import Image from 'next/image';
import { Fragment } from 'react';
import { Box } from './components/Box';
import styles from './messagesBox.module.scss';

function MessagesBox() {
  const { messageBoxes } = useMessageBoxesContext();
  const { handleCloseBox, handleOpenBox, ref } = useMessageBoxesContextFunction();

  return (
    <section className={clsx(styles['messagesBoxWrapper'])} ref={ref}>
      {messageBoxes.map((props, idex) => (
        <Fragment key={props._userId}>{props.opened ? <Box {...props} /> : null}</Fragment>
      ))}
      <div className={styles['messagesBoxSide']}>
        {messageBoxes.map(({ avatar, _userId, opened, ...props }, i) => (
          <Fragment key={_userId}>
            {!opened ? (
              <div
                className={styles['item']}
                onClick={() =>
                  handleOpenBox({
                    props: {
                      _userId,
                      avatar,
                      opened: true,
                      ...props,
                    },
                  })
                }
              >
                <Image src={avatar} width="100%" height="100%" className="rounded-full" alt="" />
                <IconClose
                  className={styles['item-icon']}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseBox({
                      props: {
                        ...props,
                        _userId,
                        avatar,
                        opened: false,
                        _state: true,
                      },
                    });
                  }}
                />
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>
    </section>
  );
}

export default MessagesBox;
