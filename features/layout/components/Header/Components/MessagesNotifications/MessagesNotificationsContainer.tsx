import { Image } from '@Components/Image';
import { CONTACT } from '@Constant/Contact';
import DetectContext from '@Context/DetectElement.Context';
import { useMessageBoxesContextFunction } from '@Context/MessagesBox.Context';
import { useMessagesConversations } from '@Hooks/conversations/useMessagesConversations';
import useAuthentication from '@Hooks/useAuthentication';
import { ConversationState, TypeConversation } from '@Types/Conversations';
import { OnlineStatus } from '@Types/Friends/index.type';
import defaultAvatar from '@public/images/defaultAvatar.png';
import clsx from 'clsx';
import moment from 'moment';
import { queryClient } from 'pages/_app';
import { Dispatch, SetStateAction, useContext, useEffect, useRef } from 'react';
import styles from '../../header.module.scss';
import { NotificationsSkeleton } from '../NotificationsSkeleton';

export function MessagesNotificationsContainer({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { data, isFetching } = useMessagesConversations();
  const auth = useAuthentication({});
  const { element } = useContext(DetectContext);
  const refMenu = useRef<HTMLDivElement | null>(null);
  const { handleAddBox } = useMessageBoxesContextFunction();
  const arrSkeleton = [1, 2, 3, 4, 5];
  const ConvertTime = (time: string | Date) => {
    let convertedTime = moment(new Date()).diff(moment(time), 'year');
    if (convertedTime) {
      return convertedTime + 'y';
    }
    convertedTime = moment(new Date()).diff(moment(time), 'week');
    if (convertedTime) {
      return convertedTime + 'w';
    }
    convertedTime = moment(new Date()).diff(moment(time), 'days');
    if (convertedTime) {
      return convertedTime + 'd';
    }
    convertedTime = moment(new Date()).diff(moment(time), 'h');
    if (convertedTime) {
      return convertedTime + 'h';
    }
    return `${moment(new Date()).diff(moment(time), 'm') || 1}m`;
  };

  useEffect(() => {
    if (element) {
      if (
        element.nextSibling !== refMenu.current &&
        element !== refMenu.current &&
        !refMenu.current?.contains(element)
      ) {
        setIsOpen(false);
      }
    }
  }, [element]);

  return (
    <section className={styles['messagesNotifications_wrapper']} draggable="false" ref={refMenu}>
      <h1 className={styles['h1']}>Chats</h1>
      <section className={styles['notifications']}>
        {isFetching
          ? arrSkeleton.map((item, idx) => <NotificationsSkeleton key={idx} />)
          : data?.map((conversation, index) => (
              <div
                key={index}
                className={clsx(styles['item'], {
                  [styles['unread']]:
                    conversation._fromUID !== auth.data?._userId &&
                    conversation._state == ConversationState.Received,
                })}
                onClick={(e) => {
                  const onlineUsers = queryClient.getQueryData<OnlineStatus[]>([CONTACT]);
                  const user = onlineUsers?.find((user) => user._userId === conversation._userId);
                  if (user) {
                    handleAddBox({
                      props: {
                        ...user,
                        _idConversations: user._idFriends,
                        _state: user ? true : false,
                        opened: true,
                        avatar: user.avatar ?? defaultAvatar,
                      },
                    });
                  } else {
                    const { _idConversations, _name, _userId, _userName, avatar } = conversation;
                    handleAddBox({
                      props: {
                        _state: false,
                        opened: true,
                        _idConversations,
                        _name,
                        _userId,
                        _userName,
                        avatar: avatar ?? defaultAvatar,
                      },
                    });
                  }
                  setIsOpen(false);
                }}
              >
                <div className={styles['image']}>
                  <Image
                    src={conversation.avatar ?? defaultAvatar}
                    alt=""
                    width="73px"
                    height="73px"
                    className="rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <div>
                    <div className={styles['content']}>
                      <p className={styles['name']}>{conversation._name}</p>
                      <p className={clsx(styles['time'], 'flex justify-between')}>
                        {conversation._fromUID === auth.data?._userId && (
                          <>
                            <span className="mr-1">You: </span>
                          </>
                        )}
                        <span className={clsx(styles['contentOfMessages'], 'flex-1 ml')}>
                          {conversation._type == TypeConversation.Delete
                            ? ' Message is deleted'
                            : conversation._content}
                        </span>
                        <span className="text-xs">{ConvertTime(conversation._createAt)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </section>
    </section>
  );
}
