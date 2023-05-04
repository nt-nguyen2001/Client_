import { getTemporary } from '@Apis/comment.api';
import { COMMENTS } from '@Constant/Comments';
import useAuthentication from '@Hooks/useAuthentication';
import { useQuery } from '@tanstack/react-query';
import { IComment, TemporaryListI } from '@Types/Comments';
import { CommentsReactionsProps, TypeReactions } from '@Types/Reactions';
import { queryClient } from 'pages/_app';
import { createContext, memo, useContext, useMemo } from 'react';
import { TemporaryContext } from '.';
import TemporaryItem from './TemporaryItem';
import styles from './commentItem.module.scss';
interface TemporaryListContextI {
  handleUpdateQuantityReplies: ({ id, _responseQuantity }: { id: string; _responseQuantity: number }) => void;
  handleAddReactions: (payload: CommentsReactionsProps) => void;
  handleDeleteReactions: (payload: CommentsReactionsProps) => void;
  handleUpdateReactions: (payload: CommentsReactionsProps, newType: TypeReactions) => void;
}

export const TemporaryListContext = createContext<TemporaryListContextI>({} as TemporaryListContextI);

function TemporaryList({ _commentId = '', styleContainer, ...props }: TemporaryListI) {
  const { _postInfo } = useContext(TemporaryContext);
  const user = useAuthentication({});

  const { data } = useQuery({
    queryKey: [COMMENTS, _postInfo._postsId, _commentId],
    queryFn: async () => {
      const res = await getTemporary({
        _postsId: _postInfo._postsId,
        offset: 0,
        _parentId: _commentId,
        _userId: user.data?._userId || '',
      });
      if (res.status !== 200) {
        throw new Error(res.message);
      }

      return res.payload;
    },
    enabled: user.data?._userId ? true : false,
    refetchOnMount: 'always',
    keepPreviousData: true,
  });

  const handleUpdateQuantityReplies = ({
    id,
    _responseQuantity,
  }: {
    id: string;
    _responseQuantity: number;
  }) => {
    queryClient.setQueryData<IComment[]>([COMMENTS, _postInfo._postsId, _commentId], (old) => {
      const newComments = old?.map((comment) => {
        if (comment._commentId === id) {
          const newComment: IComment = {
            ...comment,
            _responseQuantity,
          };
          return newComment;
          // based on limit in server
        }
        return comment;
      });
      return newComments;
    });
  };
  const handleAddReactions = (payload: CommentsReactionsProps) => {
    queryClient.setQueryData<IComment[]>([COMMENTS, _postInfo._postsId, _commentId], (prev) => {
      const comments = [...(prev ?? [])];
      return comments?.map((comment, i) => {
        const newComment: IComment = { ...comment };
        if (newComment._commentId === payload._commentId) {
          newComment._numberOfCommentsReactions += 1;

          for (let i = 0; i <= newComment.topReactions.length; i++) {
            if (newComment.topReactions[i]?._type == payload._type) {
              newComment.topReactions[i].quantity! += 1;
              break;
            } else if (i === newComment.topReactions.length - 1 || newComment.topReactions.length === 0) {
              newComment.topReactions = [{ _type: payload._type, quantity: 1 }, ...newComment.topReactions];
              break;
            }
          }
          newComment.topReactions.sort(function (a, b) {
            if ((a.quantity || 0) > (b.quantity || 0)) {
              return -1;
            }
            return 1;
          });
        }
        return newComment;
      });
    });
  };
  const handleDeleteReactions = (payload: CommentsReactionsProps) => {
    queryClient.setQueryData<IComment[]>([COMMENTS, _postInfo._postsId, _commentId], (prev) => {
      const comments = [...(prev ?? [])];
      return comments?.map((comment, i) => {
        const newComment: IComment = { ...comment };
        if (newComment._commentId === payload._commentId) {
          newComment._numberOfCommentsReactions =
            newComment._numberOfCommentsReactions - 1 > 0 ? newComment._numberOfCommentsReactions - 1 : 0;

          for (let i = 0; i <= newComment.topReactions.length; i++) {
            if (newComment.topReactions[i]?._type == payload._type) {
              const quantity = newComment.topReactions[i].quantity! - 1;
              newComment.topReactions[i].quantity = quantity > 0 ? quantity - 1 : 0;
              if (quantity === 0) {
                delete newComment.topReactions[i];
              }
              break;
            }
          }
          newComment.topReactions.sort(function (a, b) {
            if ((a.quantity || 0) > (b.quantity || 0)) {
              return -1;
            }
            return 1;
          });
        }
        return newComment;
      });
    });
  };

  const handleUpdateReactions = (payload: CommentsReactionsProps, newType: TypeReactions) => {
    queryClient.setQueryData<IComment[]>([COMMENTS, _postInfo._postsId, _commentId], (prev) => {
      const comments = [...(prev ?? [])];
      return comments?.map((comment, i) => {
        const newComment: IComment = { ...comment };
        if (newComment._commentId === payload._commentId) {
          for (let i = 0; i <= newComment.topReactions.length; i++) {
            if (newComment.topReactions[i]?._type == payload._type) {
              newComment.topReactions[i]._type = newType;
              break;
            }
          }

          newComment.topReactions.sort(function (a, b) {
            if ((a.quantity || 0) > (b.quantity || 0)) {
              return -1;
            }
            return 1;
          });
        }
        return newComment;
      });
    });
  };

  const memory = useMemo(
    () => ({ handleUpdateQuantityReplies, handleAddReactions, handleDeleteReactions, handleUpdateReactions }),
    []
  );

  return (
    <>
      <section className={styles['container']}>
        <section className={styles[styleContainer || '']}>
          <TemporaryListContext.Provider value={memory}>
            {data?.map((comment) => {
              return (
                <TemporaryItem
                  key={comment._commentId}
                  {...comment}
                  _toId={comment?._toId ?? undefined}
                  _toUserName={comment?._toUserName ?? undefined}
                  {...props}
                />
              );
            })}
          </TemporaryListContext.Provider>
        </section>
      </section>
    </>
  );
}

export default memo(TemporaryList);
