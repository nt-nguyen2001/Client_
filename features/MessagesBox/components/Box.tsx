import { MessagesNotifications } from '@Class/Notifications/MessagesNotifications';
import { IconClose } from '@Components/icons/iconClose';
import { IconDotVertical } from '@Components/icons/iconDotVertical';
import { IconLine } from '@Components/icons/iconLine';
import { IconLoading } from '@Components/icons/iconloading';
import { IconReceived } from '@Components/icons/iconReceived';
import { IconSent } from '@Components/icons/iconSent';
import { TextInput } from '@Components/Input/TextInput';
import Skeleton from '@Components/Skeleton';
import { CONVERSATIONS } from '@Constant/Conversations';
import { useMessageBoxesContextFunction } from '@Context/MessagesBox.Context';
import { useConversation } from '@Hooks/conversations/useConversation';
import useAuthentication from '@Hooks/useAuthentication';
import useHandleInfinity from '@Hooks/useHandleInfinity';
import commonStyles from '@styles/commonStyle.module.scss';
import { ConversationsData, ConversationState, TypeConversation } from '@Types/Conversations';
import { MessagesBoxI } from '@Types/MessagesBox';
import decodeHtml from '@utils/decodeHTML';
import clsx from 'clsx';
import moment from 'moment';
import Image from 'next/image';
import { queryClient } from 'pages/_app';
import { Fragment, memo, useEffect, useRef, useState, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import styles from './box.module.scss';
import stylesCommon from '@styles/commonStyle.module.scss';
import { BoxControl } from './BoxControl';
import { IconPhone } from '@Components/icons/iconPhone';
import { IconCamera } from '@Components/icons/iconCamera';
import { IconCameraVideo } from '@Components/icons/iconCameraVideo';
import { RtcClass } from '@Class/RtcClass';
import { RtcSocket } from 'Service/rtc.service';

const Box = memo(function Box({
  _name,
  avatar,
  _userId,
  _userName,
  _idConversations,
  _state = false,
}: MessagesBoxI) {
  const { handleCloseBox, handleMinimizeBox } = useMessageBoxesContextFunction();
  const auth = useAuthentication({});
  const refBox = useRef<HTMLDivElement>(null);
  const [isOpenedModal, setIsOpenedModal] = useState(false);
  const [elBoxMain, setElBoxMain] = useState<HTMLDivElement | null>(null);

  const {
    data,
    isFetchingMemo,
    handleAddConversations,
    // instanceAddConversation,
    conversationsPending,
    handleUpdateConversationsState,
    handleGetConversations,
  } = useConversation({
    _idConversations,
    from: 'box',
  });

  const position = useHandleInfinity({
    fnFetch: async (pag) => {
      queryClient.setQueryData<ConversationsData>(
        [CONVERSATIONS, _idConversations],
        (prev = { conversations: [], isFetching: false, type: 'reverse' }) => ({
          ...prev,
          offset: pag.offset,
          isFetching: true,
        })
      );
      handleGetConversations(pag);
    },
    limit: data?.isFull ? 'full' : 'infinity',
    initialsPagination: { limit: 15, offset: (data?.conversations.length || 15) - 15 },
    el: elBoxMain,
    type: 'reverse',
    enabled: data?.isFetching !== undefined && !data.isFetching && !isFetchingMemo ? true : false,
  });
  useEffect(() => {
    const handleFocus = () => {
      if (data?.conversations.length) {
        const conversation = data.conversations[data.conversations.length - 1];
        if (
          conversation._fromUID !== auth.data?._userId ||
          ('' &&
            (conversation._state == ConversationState.Sent ||
              conversation._state == ConversationState.Received))
        ) {
          handleUpdateConversationsState({ _idConversations, _state: ConversationState.Read });
          const instance = MessagesNotifications.getInstance();
          instance.received({ _idConversations: conversation._idConversations, toUID: _userId });
        }
      }
    };
    refBox.current?.addEventListener('focusin', handleFocus);
    return () => refBox.current?.removeEventListener('focusin', handleFocus);
  }, [data]);

  const oldPosition = useRef(0);

  useEffect(() => {
    if (isFetchingMemo) {
      if (elBoxMain) {
        oldPosition.current = elBoxMain.scrollHeight - elBoxMain.clientHeight;
      }
    }
  }, [isFetchingMemo]);

  useEffect(() => {
    if (data && elBoxMain && data.type === 'straight') {
      elBoxMain.scrollTo(0, elBoxMain.scrollHeight);
    } else {
      if (position.current === 0) {
        elBoxMain?.scrollTo(0, elBoxMain.scrollHeight - elBoxMain.clientHeight - oldPosition.current);
      }
    }
  }, [data, elBoxMain]);

  const ConvertTime = (time: string | Date, oldTime: string | Date) => {
    if (moment(time).diff(oldTime, 'hour') >= 12) {
      return moment(time).format('D MMM YYYY, HH:mm');
    }
    if (moment(time).get('h') !== moment(oldTime).get('h')) {
      return moment(time).format('ddd HH:mm');
    }
    return null;
  };

  return (
    <section className={clsx(styles['boxWrapper'], 'boxWrapper')} ref={refBox} tabIndex={1}>
      <div className={styles['boxTop']}>
        <div className="flex items-center cursor-default">
          <div className="relative">
            <Image height="32px" width="32px" src={avatar} className="rounded-full" alt="" />
            {_state && <span className={clsx(commonStyles['online'], styles['online'])}></span>}
          </div>
          <div className="ml-3">
            <span className="">{_name}</span>
            <span className={styles['activeTime']}>{_state ? 'online' : 'offline'}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <IconCameraVideo
            className={styles['icon-control']}
            width="18px"
            height="18px"
            onClick={() => {
              RtcSocket.makeCall({
                type: { audio: true, video: true },
                user_ring: [_userId],
                fromUID: auth.data?._userId || '',
                typeCall: '1',
                roomId: uuid(),
              });
            }}
          />
          <IconPhone
            className={styles['icon-control']}
            width="25px"
            height="25px"
            onClick={() => {
              RtcSocket.makeCall({
                type: { audio: true, video: false },
                user_ring: [_userId],
                fromUID: auth.data?._userId || '',
                typeCall: '1',
                roomId: uuid(),
              });
            }}
          />
          <IconLine
            className={styles['icon-control']}
            width="20px"
            height="20px"
            onClick={() =>
              handleMinimizeBox({
                _name,
                _userId,
                _userName,
                avatar,
                opened: false,
                _idConversations,
                _state,
              })
            }
          />
          <IconClose
            className={styles['icon-control']}
            width="20px"
            height="20px"
            onClick={() =>
              handleCloseBox({
                props: {
                  _name,
                  _userId,
                  _userName,
                  avatar,
                  opened: false,
                  _idConversations,
                  _state: true,
                },
              })
            }
          />
        </div>
      </div>
      <div className={styles['boxMain']} ref={(ref) => setElBoxMain(ref)}>
        {isFetchingMemo && !data ? (
          <>
            <div className={clsx(styles['boxMain-item'])}>
              <Skeleton className={clsx(styles['you'])} type="text" width="150px" height="30px" />
            </div>
            <div className={clsx(styles['boxMain-item'])}>
              <Skeleton className={styles['yourFriend']} type="text" width="80px" height="30px" />
            </div>
            <div className={clsx(styles['boxMain-item'])}>
              <Skeleton className={clsx(styles['you'])} type="text" width="250px" height="140px" />
            </div>
            <div className={clsx(styles['boxMain-item'])}>
              <Skeleton className={styles['yourFriend']} type="text" width="100px" height="90px" />
            </div>
          </>
        ) : data?.conversations?.length ? (
          <>
            {isFetchingMemo || data.isFetching ? (
              <div>
                <IconLoading className="mx-auto" width="23px" height="23px" />
              </div>
            ) : null}
            {/*Hmmm should separate it into a component? */}
            {data.conversations.map(
              (
                { _content, _createAt, _fromUID, _idConversations, _state, _taggedUID, _textId, _type },
                i
              ) => {
                return (
                  <Fragment key={_textId}>
                    {_content !== undefined ? (
                      <>
                        {i === 0 && (
                          <span className={styles['time']}>
                            {moment(_createAt).format(
                              moment(_createAt).diff(new Date(), 'day') <= -1 || i === 0
                                ? 'D MMM YYYY, HH:mm'
                                : 'HH:mm'
                            )}
                          </span>
                        )}

                        {i - 1 >= 0 && (
                          <span className={styles['time']}>
                            {ConvertTime(_createAt, data.conversations[i - 1]._createAt)}
                          </span>
                        )}
                        <div
                          className={clsx(styles['boxMain-item'], {
                            [styles['isLoading']]: conversationsPending.data?.get(_textId),
                          })}
                          key={_textId}
                        >
                          <div
                            className={clsx(
                              styles[_fromUID === auth.data?._userId || '' ? 'you' : 'yourFriend'],
                              {
                                [styles['deleted']]: _type == TypeConversation.Delete,
                              }
                            )}
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: decodeHtml(
                                  _type == TypeConversation.Delete ? 'Message is deleted.' : _content
                                ),
                              }}
                            ></div>
                            {_fromUID === auth.data?._userId && (
                              <BoxControl _textId={_textId} _idConversations={_idConversations} />
                            )}
                          </div>
                          {_fromUID === auth.data?._userId || '' ? (
                            _state == ConversationState.Sent ? (
                              <IconSent className={styles['icon-sent']} />
                            ) : _state == ConversationState.Received ? (
                              <IconReceived className={styles['icon-sent']} />
                            ) : (
                              ((i === data.conversations.length - 1 && _state == ConversationState.Read) ||
                                data.conversations[i + 1]?._state != _state) && (
                                <div className="flex items-end">
                                  <Image
                                    height="20px"
                                    width="20px"
                                    src={avatar}
                                    className="rounded-full"
                                    alt=""
                                  />
                                </div>
                              )
                            )
                          ) : null}
                        </div>
                      </>
                    ) : null}
                  </Fragment>
                );
              }
            )}
          </>
        ) : null}
      </div>
      <div className={styles['boxBottom']}>
        <TextInput
          className={styles['inp']}
          submit={(encodedContent) => {
            handleAddConversations(
              {
                _textId: uuid(),
                _content: encodedContent,
                _createAt: new Date(),
                _fromUID: auth.data?._userId || '',
                _state: ConversationState.Sent,
                _taggedUID: null,
                _idConversations,
              },
              { toUID: _userId }
            );
          }}
          placeholder="Aa"
        />
      </div>
    </section>
  );
});

export { Box };
