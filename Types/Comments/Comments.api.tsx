import { Posts } from '@Types/Post/Post.type';
import { CommentsReactionsProps } from '@Types/Reactions';
import { User } from '@Types/User/User.type';
import { IComment } from '.';

type CreatedCommentProps = {
  _commentId: string;
  _createAt: string | Date;
  _content: string;
  _parentId?: string | null;
  _toId?: string | null;
} & Pick<Posts, '_postsId'> &
  Pick<User, '_userId'>;

// export interface GetComments extends IComment {
//   topReactions: {
//     quantity: number;
//     _type: string;
//   }[];
// }
type EditCommentAPIProps = Pick<IComment, '_commentId' | '_content' | '_toId'>;

export type { CreatedCommentProps };
