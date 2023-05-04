import { AnnouncementProps } from '@Types/Announcements';
import { User } from '@Types/User/User.type';
import { PostReactionsProps } from '.';

export interface ReactionsPayload {
  reactions: PostReactionsProps & Pick<User, '_name' | 'avatar'>[];
  topReactions: ({ quantity: number } & Pick<PostReactionsProps, '_reactionId' | '_type'>)[];
}

export type UpdateReactionsProps = Pick<PostReactionsProps, '_reactionId' | '_type'>;
