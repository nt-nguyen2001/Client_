import { Image } from '@Components/Image';
import PostModal from '@Components/Modal/PostModal';
import Reaction from '@Components/Reaction';
import Skeleton from '@Components/Skeleton';
import Temporary from '@Components/Temporary';
import { ZoomImage } from '@Components/ZoomImage';
import useAuthentication from '@Hooks/useAuthentication';
import useHandleReactions from '@Hooks/useHandleReactions';
import useHoverReactions from '@Hooks/useHoverReactions';
import { useReactions } from '@Hooks/useReactions';
import defaultAvatar from '@public/images/defaultAvatar.png';
import commonStyles from '@styles/commonStyle.module.scss';
import { icon } from '@Types/icon';
import { EditProps, FCDelete, FCEdit, PostsProps } from '@Types/Post/Post.type';
import { PostReactionsProps, TypeReactions } from '@Types/Reactions';
import decodeHtml from '@utils/decodeHTML';
import clsx from 'clsx';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo, useState } from 'react';
import { AiOutlineLike } from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
import { FaRegCommentAlt } from 'react-icons/fa';
import { v4 as uuid } from 'uuid';
import MenuControl from './components/MenuControl';
import style from './post.module.scss';
interface PostI extends PostsProps {
  handleDelete: FCDelete;
  handleEdit: FCEdit;
  isYouProp?: string;
  // _numberOfPosts: number;
}

function Post({
  _content,
  _createAt,
  _images,
  numberOfReactions,
  _name,
  _postsId,
  _userId,
  numberOfComments,
  currentComments,
  avatar,
  viewer_actor,
  type_reaction,
  reactionId,
  _userName,
  isYouProp,
  handleDelete,
  handleEdit,
}: PostI) {
  const [isMenu, setIsMenu] = useState(false);
  const [isPost, setIsPost] = useState(false);
  const [isOpenCmt, setIsOpenCmt] = useState(false);
  const { ref } = useHoverReactions({
    fnEnter: () => setIsReaction(true),
    fnOut: () => setIsReaction(false),
  });
  const router = useRouter();
  const [isReaction, setIsReaction] = useState(false);
  const { data } = useAuthentication({});
  const [showImages, setShowImages] = useState(false);
  const { reaction, handleReactions } = useHandleReactions({
    initialsReactions: type_reaction || 0,
  });

  const reactions = useReactions({ _postId: _postsId });

  const handleEditPost = ({
    dirty,
    content = '',
    id = _postsId,
    newImages = [],
    dirtyImages = [],
    _userId,
  }: EditProps) => {
    if (dirty) {
      handleEdit({ dirty, content, id, newImages, dirtyImages, _userId });
    }
    setIsPost((prev) => !prev);
  };
  const handleShowComment = () => {
    setIsOpenCmt(true);
  };

  const isYou = data?._userId === _userId;
  const handleShowMenu = (state: boolean) => {
    setIsMenu(state);
  };
  return (
    <>
      <section>
        <div className={style['wrapper']}>
          <div className={style['user']}>
            <div className="flex">
              <div className="mr-3">
                <Image
                  src={avatar || defaultAvatar}
                  alt=""
                  height="40px"
                  width="40px"
                  className="rounded-full"
                />
              </div>
              <div>
                {_name ? (
                  <Link href={`/${_userName}`}>
                    <a>
                      <p className="hover:underline cursor-pointer inline">{_name}</p>
                    </a>
                  </Link>
                ) : (
                  <Skeleton type="text" width="90px" height="15px" />
                )}

                <p className={style['day']}>
                  {(_createAt &&
                    moment(
                      moment(_createAt).format('YYYYMMDD hh:mm:ss a'),
                      'YYYYMMDD HH:mm:ss a'
                    ).fromNow()) || <Skeleton type="text" width="50px" height="15px" className="mt-2" />}
                </p>
              </div>
            </div>
            {isYou ? (
              <div className="relative mt-3" tabIndex={-1}>
                <BsThreeDots
                  className={style['bars']}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowMenu(!isMenu);
                  }}
                />
                {(isMenu && (
                  <MenuControl
                    handleDelete={handleDelete}
                    id={_postsId}
                    handleShowMenu={handleShowMenu}
                    handleShowPost={() => setIsPost((prev) => !prev)}
                  />
                )) ||
                  null}
              </div>
            ) : null}
          </div>
          <p
            className="px-4 pt-1 text-sm"
            dangerouslySetInnerHTML={{ __html: _content ? decodeHtml(_content) : '' }}
          ></p>
          {_images?.length ? (
            <div className={style[`container-image-${_images.length >= 5 ? 'grid' : 'flex'}`]}>
              {_images.map((image, index) => {
                if (!image) return null;
                if (index >= 5) {
                  return null;
                }

                return (
                  <div
                    key={index}
                    className={clsx(style[`image-${_images.length >= 5 ? 'grid' : 'flex'}`], 'relative')}
                    onClick={() => {
                      setShowImages(true);
                    }}
                  >
                    {_images.length > 6 && index === 4 ? (
                      <div className={style['overlay']} data-number={_images.length}></div>
                    ) : null}
                    <Image
                      src={image}
                      className="object-cover"
                      layout="responsive"
                      width="100%"
                      height="100%"
                      alt=""
                    />
                  </div>
                );
              })}
            </div>
          ) : null}

          <div className={style['wrapper-interact']}>
            <div className={style['main']}>
              {numberOfReactions ? (
                <div className="flex items-center cursor-pointer hover:underline">
                  {reactions.data?.topReactions.length ? (
                    <div className="flex">
                      {reactions.data.topReactions.map((reaction, i) => (
                        <div
                          className={style['icon-react']}
                          style={{
                            border: '3px solid #242526',
                            transform: `translateX(-${i * 5}px)`,
                            zIndex: reactions.data!.topReactions.length - i,
                          }}
                          key={i}
                        >
                          {icon[TypeReactions[reaction._type] as keyof typeof TypeReactions]}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {numberOfReactions}
                </div>
              ) : (
                <div></div>
              )}
              <div className="pointer-events-none">
                {numberOfComments ? <p>{numberOfComments} Comments</p> : null}
              </div>
            </div>
            <div className={style['interact']}>
              <div
                className={style['interact-control']}
                ref={ref}
                onClick={() => {
                  const payload: PostReactionsProps = {
                    _fromUserId: data?._userId || '',
                    _postId: _postsId,
                    _reactionId: reactionId ?? uuid(),
                    _type: reaction || TypeReactions.Like,
                  };

                  handleReactions({
                    payload,
                    _postsId,
                    toUser: _userId,
                    type_announcement: 'reacted to your post.',
                    _toUserName: _userName,
                  });
                }}
              >
                {reaction ? (
                  <>
                    <div className={style['icon-react']}>
                      {icon[TypeReactions[reaction] as keyof typeof TypeReactions]}
                    </div>
                    <p className={commonStyles[TypeReactions[reaction]]}>{TypeReactions[reaction]}</p>
                  </>
                ) : (
                  <>
                    <AiOutlineLike />
                    <p>like</p>
                  </>
                )}
                {isReaction ? (
                  <Reaction
                    fn={({ type }) => {
                      const payload: PostReactionsProps = {
                        _fromUserId: data?._userId || '',
                        _postId: _postsId,
                        _reactionId: reactionId ?? uuid(),
                        _type: type || TypeReactions.Like,
                      };
                      handleReactions({
                        _postsId,
                        toUser: _userId,
                        type_announcement: 'reacted to your post.',
                        payload,
                        _toUserName: _userName,
                      });
                    }}
                  />
                ) : null}
              </div>
              <div className={style['interact-control']} onClick={handleShowComment}>
                <FaRegCommentAlt />
                <p>Comment</p>
              </div>
            </div>
          </div>
          {isOpenCmt && (
            // <CommentComponent authentication={data} _userNameOfPost={_userId} _postsId={_postsId} depth={2} />
            <Temporary
              _userNameOfPost={_userName}
              _postsId={_postsId}
              _userId={_userId}
              depth={3}
              currentComments={currentComments}
            />
          )}
        </div>
      </section>
      {isPost ? (
        <PostModal
          _userId={_userId}
          CloseModal={() => {}}
          _name={_name}
          avatar={avatar}
          cb={handleEditPost}
          title="Edit post"
          type="update"
          _createAt={_createAt}
          numberOfReactions={numberOfReactions}
          numberOfComments={numberOfComments}
          _postsId={_postsId}
          _content={_content}
          _images={_images}
          _userName={data?._userName || ''}
          currentComments={currentComments}
          reactionId={reactionId}
          type_reaction={type_reaction}
          viewer_actor={viewer_actor}
        />
      ) : null}
      {showImages ? <ZoomImage images={_images} cb={() => setShowImages(false)} /> : null}
    </>
  );
}

export default memo(Post);
