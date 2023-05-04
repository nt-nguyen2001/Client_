import InputComment from '@Components/Temporary/components/InputComment';
import Reaction from '@Components/Reaction';
import Skeleton from '@Components/Skeleton';
import useAuthentication from '@Hooks/useAuthentication';
import useHandleReactions from '@Hooks/useHandleReactions';
import useHoverReactions from '@Hooks/useHoverReactions';
import defaultAvatar from '@public/images/defaultAvatar.png';
import { announcementType } from '@Types/Announcements';
import { IComment } from '@Types/Comments';
import { icon } from '@Types/icon';
import { CommentsReactionsProps, TypeReactions } from '@Types/Reactions';
import decodeHtml from '@utils/decodeHTML';
import clsx from 'clsx';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { TemporaryContext } from '.';
import styles from './commentItem.module.scss';
import Replies from './components/Replies';
import MenuControl from './MenuControl';
import TemporaryList, { TemporaryListContext } from './TemporaryList';
import { handleGetReplies } from './utils/GetReplies';
import commonStyles from '@styles/commonStyle.module.scss';

type TemporaryItemI = {
  currDepth: number;
  handleShowParentInput?: (
    _toUserName?: string | null,
    _toId?: string | null,
    _userNameTag?: string | null
  ) => void;
} & IComment;

function TemporaryItem({
  avatar,
  _name,
  _toId,
  _toUserName = '',
  _content,
  _createAt,
  _responseQuantity,
  _userId,
  _commentId,
  currDepth,
  _parentId,
  _userNameTag,
  _userName,
  _numberOfCommentsReactions,
  topReactions,
  type_reaction_viewer,
  reactionId_viewer,
  handleShowParentInput,
}: TemporaryItemI) {
  const isShowReplies = useRef<boolean>(false);
  const { data } = useAuthentication({});
  const offset = useRef(0);
  const { handleUpdateQuantityReplies, handleAddReactions, handleDeleteReactions, handleUpdateReactions } =
    useContext(TemporaryListContext);
  const { depth, handlePostComment, handleEditComment, _postInfo } = useContext(TemporaryContext);
  const [isShowInput, setIsShowInput] = useState(false);
  const [isShowReactions, setIsShowReactions] = useState(false);
  const { reaction, handleReactions, setReaction } = useHandleReactions({
    initialsReactions: type_reaction_viewer ? Number(type_reaction_viewer) : -1,
  });
  useEffect(() => {
    if (type_reaction_viewer) {
      setReaction(Number(type_reaction_viewer));
    } else {
      setReaction(undefined);
    }
  }, [type_reaction_viewer]);
  const [size, setSize] = useState({
    x: '50%',
    y: '0',
  });
  const refControlReact = useRef<HTMLDivElement>(null);
  const refItem = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // trigger re-render
    if (refControlReact.current && refItem.current) {
      if (refControlReact.current.offsetWidth > refItem.current.offsetWidth) {
        setSize({
          x: '-25%',
          y: '60%',
        });
      }
    }
  }, []);
  const { ref } = useHoverReactions({
    fnEnter: () => setIsShowReactions(true),
    fnOut: () => setIsShowReactions(false),
  });
  const isYou = data?._userId === _userId;

  const [to, setTo] = useState<{
    _parentId: string;
    _toUserName: null | string;
    _toId: null | string;
    _userNameTag: null | string;
  }>({
    _parentId: _commentId,
    _toUserName: null,
    _toId: null,
    _userNameTag: null,
  });

  const [isShowEditInput, setIsShowEditInput] = useState(false);

  const handleShowInput = (
    _toUserName?: string | null,
    _toId?: string | null,
    _userNameTag?: string | null
  ) => {
    if (depth !== currDepth) {
      if (!isShowInput) {
        setIsShowInput(true);
        offset.current += 5;
        const quantity = _responseQuantity - offset.current;
        handleUpdateQuantityReplies({ id: _commentId, _responseQuantity: quantity > 0 ? quantity : 0 });
        isShowReplies.current = true;
      }
    } else {
      if (handleShowParentInput) {
        handleShowParentInput(_toUserName, _toId, _userNameTag);
      }
    }

    setTo((prev) => ({
      ...prev,
      _toId: _toId || null,
      _toUserName: _toUserName || null,
      _userNameTag: _userNameTag || null,
    }));
  };
  const GetReplies = () => {
    const quantity = _responseQuantity - 5 > 0 ? _responseQuantity - 5 : 0;
    if (!isShowReplies.current) {
      isShowReplies.current = true;
      handleUpdateQuantityReplies({ id: _commentId, _responseQuantity: quantity });
    } else {
      handleUpdateQuantityReplies({ id: _commentId, _responseQuantity: quantity });
      handleGetReplies({ _postsId: _postInfo._postsId, _userId, offset: offset.current, _commentId });
    }
    offset.current += 5;
  };

  if (isShowEditInput) {
    return (
      <>
        <InputComment
          isSpace={false}
          avatar={avatar}
          postComment={(encodeContent, isTagName) => {
            setIsShowEditInput(false);
            handleEditComment({
              _commentId,
              _content: encodeContent,
              _toId: isTagName ? _toId : null,
              _parentId,
              _toUserName: isTagName ? _toUserName : null,
              _userNameTag: isTagName ? _userNameTag : null,
            });
          }}
          _to={{
            _parentId: _parentId ?? null,
            _toId: _toId ?? null,
            _toUserName: _toUserName ?? null,
          }}
          content={_content}
        />
        <div className="flex justify-end mb-2">
          <p className={styles['cancel']} onClick={() => setIsShowEditInput(false)}>
            cancel
          </p>
        </div>
      </>
    );
  }

  const handleReactionsItem = (type: TypeReactions) => {
    const payload: CommentsReactionsProps = {
      _reactionId: reactionId_viewer ?? uuid(),
      _commentId,
      _fromUserId: data?._userId || '',
      _type: type,
      _postId: _postInfo._postsId,
    };

    handleReactions({
      payload,
      toUser: _userId,
      type_announcement: 'reacted to your comment.',
      _postsId: _postInfo._postsId,
      _toUserName: _userName,
      fnCreate: () => {
        handleAddReactions(payload);
      },
      fnDelete: (prev) => {
        handleDeleteReactions(prev as CommentsReactionsProps);
      },
      fnUpdate: ({ newType, prev }) => {
        handleUpdateReactions(prev as CommentsReactionsProps, newType);
      },
    });
  };

  return (
    <>
      <div className={styles['commentItem']}>
        <div className="flex mb-2 items-start">
          <div>
            <Image src={avatar ?? defaultAvatar} alt="" width="32px" height="32px" className="rounded-full" />
          </div>
          <div className="pl-3 flex-1 ">
            <div className="flex items-center">
              <div className={styles['comment']} ref={refItem}>
                <p className={styles['comment-userName']}>{_name}</p>
                <div className="flex flex-wrap">
                  {_userNameTag ? (
                    <Link href={_userNameTag}>
                      <a className={clsx(styles['comment-userName'], styles['comment-userName-link'])}>
                        {_toUserName}
                      </a>
                    </Link>
                  ) : null}
                  <p className="text-[15px]" dangerouslySetInnerHTML={{ __html: decodeHtml(_content) }}></p>
                </div>
                {/* It should  be separated into a component */}

                {_numberOfCommentsReactions ? (
                  <div
                    className={styles['reactionsContainer']}
                    style={{
                      transform: `translate(${size.y},${size.x})`,
                    }}
                  >
                    {topReactions.map((item, index) => {
                      if (index > 2 || !item) {
                        return null;
                      }
                      return (
                        <div className="w-4" key={index}>
                          {icon[TypeReactions[Number(item?._type)] as keyof typeof TypeReactions]}
                        </div>
                      );
                    })}
                    {_numberOfCommentsReactions > 1 ? (
                      <span className="pr-1">{_numberOfCommentsReactions}</span>
                    ) : null}
                  </div>
                ) : null}
              </div>
              {data?._userId === _userId ? (
                <MenuControl
                  _commentId={_commentId}
                  _parentId={_parentId}
                  handleEdit={() => setIsShowEditInput(true)}
                />
              ) : null}
            </div>
            <div className={styles['comment_control']} ref={refControlReact}>
              <div className="relative" ref={ref}>
                {isShowReactions ? (
                  <Reaction
                    fn={({ type }) => {
                      handleReactionsItem(type);
                    }}
                  />
                ) : null}
                <p
                  className={clsx(commonStyles[TypeReactions[reaction ?? 0]], styles['action'])}
                  onClick={() => {
                    handleReactionsItem(reaction || TypeReactions.Like);
                  }}
                >
                  {reaction ? TypeReactions[reaction] : 'Like'}
                </p>
              </div>
              <p
                className={styles['action']}
                onClick={() => {
                  if (!isYou) {
                    handleShowInput(_name, _userId, _userName);
                  } else {
                    handleShowInput();
                  }
                }}
              >
                Reply
              </p>
              <span className="font-medium">
                {(_createAt &&
                  moment(
                    moment(_createAt).format('YYYYMMDD hh:mm:ss a'),
                    'YYYYMMDD HH:mm:ss a'
                  ).fromNow()) || <Skeleton type="text" width="50px" height="15px" className="mt-2" />}
              </span>
            </div>
          </div>
        </div>
      </div>
      {isShowReplies.current ? (
        <TemporaryList
          currDepth={currDepth + 1}
          _commentId={_commentId}
          styleContainer={'container'}
          handleShowParentInput={depth === currDepth + 1 ? handleShowInput : undefined}
        />
      ) : null}
      <Replies quantity={_responseQuantity} cb={GetReplies} />

      {(isShowInput && (
        <InputComment
          avatar={data?.avatar || ''}
          postComment={(encodeContent, isTagName) => {
            let _type: keyof typeof announcementType | null = 'replied to your comment on another post.';

            if (!isTagName) {
              _type = null;
            } else if (to._toId !== _postInfo._userId) {
              _type = 'replied to your comment on his post.';
            } else {
              _type = 'replied to your comment on your post.';
            }

            handlePostComment({
              commentId: _commentId,
              encodeContent,
              to: {
                ...to,
                _userNameTag: isTagName ? to._userNameTag : null,
                _toUserName: isTagName ? to._toUserName : null,
              },
              _type,
            });
          }}
          _to={to}
        />
      )) ||
        null}
    </>
  );
}

export default memo(TemporaryItem);
