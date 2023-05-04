import { getTemporary } from '@Apis/comment.api';
import { COMMENTS } from '@Constant/Comments';
import { IComment, TemporaryListI } from '@Types/Comments';
import { Posts } from '@Types/Post/Post.type';
import { User } from '@Types/User/User.type';
import { queryClient } from 'pages/_app';

type GetRepliesT = (
  props: Pick<IComment, '_commentId'> & Pick<Posts, '_postsId'> & Pick<User, '_userId'> & { offset: number }
) => void;

export const handleGetReplies: GetRepliesT = async ({ _postsId, _userId, _commentId = '', offset }) => {
  const res = await getTemporary({ _postsId, _userId, offset, _parentId: _commentId });
  if (res.status !== 200) {
    throw Error(res.message);
  }

  queryClient.setQueryData<IComment[]>([COMMENTS, _postsId, _commentId], (old) => [
    ...(old ?? []),
    ...(res.payload ?? []),
  ]);
};
