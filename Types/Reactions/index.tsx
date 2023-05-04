import { IComment } from '@Types/Comments';
import { Posts } from '@Types/Post/Post.type';

export enum TypeReactions {
  'Like' = 1,
  'Wow',
  'Angry',
  'Sad',
  'Haha',
  'Love',
  'Care',
}
export interface ReactionsComponentProps {
  fn: ({ type }: { type: TypeReactions }) => void;
}
export interface PostReactionsProps {
  _reactionId: string;
  _fromUserId: string;
  _type: TypeReactions;
  _postId: string;
}

export type CommentsReactionsProps = Pick<IComment, '_commentId'> & PostReactionsProps;
