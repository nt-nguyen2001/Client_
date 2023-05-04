import { AnnouncementPayload } from '@Types/Announcements';
import { Posts } from '@Types/Post/Post.type';
import { TypeReactions } from '@Types/Reactions';
import { StaticImageData } from 'next/image';

export enum LoadingState {
  loading,
  finished,
  error,
}

export interface FetchResponse<T> {
  payload?: T;
  status: number;
  message: string;
}

export interface Validation {
  required?: {
    value: boolean;
    message: string;
  };
  pattern?: {
    value: RegExp;
    message: string;
  };
  custom?: {
    isValid: (value: string) => boolean;
    message: string;
  };
}

export interface IComment {
  _commentId: string;
  _createAt: string | Date;
  _content: string;
  _userId: string;
  _userName: string;
  _parentId?: string | null;
  _toId?: string | null;

  _postsId: string;
  topReactions: {
    _type?: string | TypeReactions;
    quantity?: number;
  }[];
  reactionId_viewer?: string;
  type_reaction_viewer?: string | TypeReactions;
  _numberOfCommentsReactions: number;
  _name: string;
  _toUserName?: string | null;
  _userNameTag?: string | null;
  avatar: string | StaticImageData;
  _responseQuantity: number;
}

export type PostCommentT = (
  props: {
    encodeContent: string;
    to: {
      _parentId: string | null;
      _toUserName: string | null;
      _toId: string | null;
      _userNameTag: string | null;
    };
    commentId: string;
  } & Pick<AnnouncementPayload, '_type'>
) => void;

export type DeleteCommentT = (props: Pick<IComment, '_commentId' | '_parentId'>) => void;

export type EditCommentProps = Pick<
  IComment,
  '_commentId' | '_content' | '_toId' | '_parentId' | '_toUserName' | '_userNameTag'
>;

export type TemporaryListI = {
  _commentId?: string;
  currDepth: number;
  styleContainer?: string;
  handleShowParentInput?: (
    _toUserName?: string | null,
    _toId?: string | null,
    _userNameTag?: string | null
  ) => void;
};
