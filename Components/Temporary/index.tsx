import { createComment, deleteComments, EditComments } from '@Apis/comment.api';
import { ActivityNotifications } from '@Class/Notifications/ActivityNotifications';
import { CommentsClass } from '@Class/Comment';
// import { announcementInstance } from '@Class/Announcement';
import InputComment from '@Components/Temporary/components/InputComment';
import { COMMENTS } from '@Constant/Comments';
import useAuthentication from '@Hooks/useAuthentication';
import { useDetailedAnnouncements } from '@Hooks/useDetailedAnnouncements';
import { useMutation } from '@tanstack/react-query';
import { AnnouncementProps, TypeLink } from '@Types/Announcements';
import { DeleteCommentT, EditCommentProps, FetchResponse, IComment, PostCommentT } from '@Types/Comments';
import { Posts } from '@Types/Post/Post.type';
import { User } from '@Types/User/User.type';
import { queryClient } from 'pages/_app';
import { createContext, memo, useCallback, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Replies from './components/Replies';
import TemporaryList from './TemporaryList';
import { handleGetReplies } from './utils/GetReplies';

type TemporaryListI = {
  _commentId?: string;
  depth: number;
  currentComments: number;
  _userNameOfPost: string;
} & Pick<Posts, '_postsId'> &
  Pick<User, '_userId'>;

type TemporaryContextI = {
  _postInfo: Pick<Posts, '_userId' | '_postsId'>;
  depth: number;
  handlePostComment: PostCommentT;
  handleDeleteComment: DeleteCommentT;
  handleEditComment: (props: EditCommentProps) => void;
};

export const TemporaryContext = createContext<TemporaryContextI>({} as TemporaryContextI);

function Temporary({
  _postsId,
  _userId,
  _userNameOfPost,
  _commentId = '',
  depth,
  currentComments,
}: TemporaryListI) {
  const auth = useAuthentication({});
  const [quantity, setQuantity] = useState(currentComments >= 5 ? currentComments - 5 : 0);
  const announcement = useDetailedAnnouncements();
  const PostCommentMutation = useMutation<
    FetchResponse<unknown>,
    unknown,
    { payload: IComment; key: string; toUserId: string | null }
  >({
    mutationFn: async ({ payload, key, toUserId }) => {
      queryClient.setQueryData<IComment[]>([COMMENTS, _postsId, key], (old) => {
        // const comment: GetComments = {
        //   ...payload,
        //   topReactions: [],
        // };
        return [payload, ...(old ?? [])];
      });
      const { _name, _responseQuantity, avatar, _toUserName, ...props } = payload;

      const instance = CommentsClass.getInstance();
      if (toUserId && toUserId !== auth.data?._userId) {
        instance.forwardComments(payload, { _userId: toUserId });
      }

      return createComment({ ...props, _postsId });
    },
    onSuccess: (data) => {
      if (data.status !== 200) {
        throw new Error(data.message);
      }
    },
  });

  const DeleteCommentMutation = useMutation<
    FetchResponse<unknown>,
    unknown,
    Pick<IComment, '_commentId' | '_parentId'>
  >({
    mutationFn: ({ _commentId, _parentId }) => {
      queryClient.setQueryData<IComment[]>([COMMENTS, _postsId, _parentId || ''], (oldComments = []) =>
        oldComments.filter((comment) => comment._commentId !== _commentId)
      );
      return deleteComments(_commentId, auth.data?._userId || '');
    },
  });
  const EditCommentMutation = useMutation<FetchResponse<unknown>, unknown, EditCommentProps>({
    mutationFn: (props) => {
      queryClient.setQueryData<IComment[]>(
        [COMMENTS, _postsId, props._parentId ?? ''],
        (oldComments = []) => {
          const newComments = oldComments.map((comment) => {
            if (comment._commentId === props._commentId) {
              return {
                ...comment,
                ...props,
              };
            }
            return comment;
          });
          return newComments;
        }
      );
      const { _parentId, ...comment } = props;
      return EditComments(comment);
    },
  });

  const handlePostComment: PostCommentT = ({ commentId, encodeContent, to, _type }) => {
    const comment: IComment = {
      _commentId: uuid(),
      _content: encodeContent,
      _createAt: new Date(),
      _userId: auth.data?._userId || '',
      _postsId,
      avatar: auth.data?.avatar || '',
      _responseQuantity: 0,
      _name: auth.data?._name || '',
      _userName: auth.data?._userName || '',
      _numberOfCommentsReactions: 0,
      topReactions: [],
      ...to,
    };
    PostCommentMutation.mutate({ payload: comment, key: commentId, toUserId: to._toId });

    let userId = to._toId ?? _userId;

    const payload: AnnouncementProps = {
      _createAt: new Date(),
      _fromUser: auth.data?._userId || '',
      _idAnnouncement: uuid(),
      _type,
      _userId: userId,
      state: 0,
      avatar: auth.data?.avatar || '',
      _name: auth.data?._name || '',
      _idLink: _postsId,
      _toUserName: _userNameOfPost,
      _typeLink: TypeLink.Post,
      _idOther: comment._commentId,
    };

    if (_type) {
      const announcementInstance = ActivityNotifications.getInstance();
      announcementInstance.create({ payload, toUserId: userId });
    }
  };

  const handleEditComment = (props: EditCommentProps) => {
    EditCommentMutation.mutate(props);
  };

  const handleDeleteComment: DeleteCommentT = (props) => {
    DeleteCommentMutation.mutate(props);
  };

  const memo = useMemo(
    () => ({
      handlePostComment,
      handleDeleteComment,
      handleEditComment,
      depth,
      _postInfo: { _postsId, _userId },
    }),
    []
  );

  const PostComment = useCallback((encodeContent: string) => {
    handlePostComment({
      commentId: '',
      encodeContent,
      to: {
        _userNameTag: null,
        _parentId: null,
        _toId: null,
        _toUserName: null,
      },
      _type: _userId !== auth.data?._userId ? 'comment on your post.' : null,
    });
  }, []);

  const _to = useMemo(() => ({ _parentId: '', _toId: '', _toUserName: '' }), []);

  return (
    <TemporaryContext.Provider value={memo}>
      <InputComment avatar={auth.data?.avatar || ''} isSpace={false} postComment={PostComment} _to={_to} />
      <TemporaryList currDepth={1} />
      <Replies
        cb={() => {
          setQuantity((prev) => {
            const quantity = prev - 5 >= 0 ? prev - 5 : 0;
            const offset = currentComments - prev;
            handleGetReplies({ _postsId, _userId, offset, _commentId });
            return quantity;
          });
        }}
        quantity={quantity}
        margin={false}
      />
    </TemporaryContext.Provider>
  );
}

export default memo(Temporary);
