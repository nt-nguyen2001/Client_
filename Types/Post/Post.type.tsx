import { TypeReactions } from '@Types/Reactions';
import { User } from '@Types/User/User.type';
import { StaticImageData } from 'next/image';

export interface Posts {
  _postsId: string;
  _userId: string;
  _createAt: string;
  _content: string;
  _userName: string;
}
interface ReactionProps {
  numberOfReactions: number;
  users?: { _type: TypeReactions } & Pick<User, '_userId' | '_name' | 'avatar'>[];
}
export type PostsProps = {
  numberOfComments: number;
  currentComments: number;

  _images: string[];

  _name: string;
  avatar: string | StaticImageData;

  viewer_actor: Pick<User, '_userId'>;
  type_reaction: TypeReactions;
  reactionId: string;
} & Posts &
  Pick<ReactionProps, 'numberOfReactions'>;
// export type PostProps = {
//   post: Posts;
//   urls: string[];
// };

export interface EditProps {
  dirty: boolean;
  _userId: string;
  newImages?: string[];
  id?: string;
  content?: string;
  dirtyImages?: string[];
}

// export type CreatedPostsProps = Posts & Pick<PostsProps, '_images'>;

export type FCPost = (
  props: Omit<PostsProps, 'currentComments' | 'viewer_actor' | 'type_reaction' | 'reactionId'>
) => void;
export type FCDelete = (id: string) => void;
export type FCEdit = (props: Required<EditProps>) => void;

export interface PostsReduce extends Omit<PostsProps, '_images'> {
  _images: string;
}

export interface UserPostPayload {
  posts: PostsProps[];

  _numberOfPosts: number;
}
