import { DeleteDetailedAnnouncement, DeleteDetailedAnnouncementByIdOther } from '@Apis/announcements.api';
import {
  CreateCommentsReactions,
  DeleteCommentsReactions,
  UpdateCommentsReactions,
} from '@Apis/commentsReactions.api';
import { CreatePostReactions, DeletePostReactions, UpdatePostReactions } from '@Apis/postsReactions.api';
import { ActivityNotifications } from '@Class/Notifications/ActivityNotifications';
import { AnnouncementProps, TypeLink } from '@Types/Announcements';
import { CommentsReactionsProps, PostReactionsProps, TypeReactions } from '@Types/Reactions';

import { v4 as uuid } from 'uuid';
import useAuthentication from './useAuthentication';
import { useDebounce } from './useDebounce';
import { useState, useRef } from 'react';
import { Posts } from '@Types/Post/Post.type';
import { useDetailedAnnouncements } from './useDetailedAnnouncements';

function isCommentsReactionsProps(
  props: CommentsReactionsProps | PostReactionsProps
): props is CommentsReactionsProps {
  return (props as CommentsReactionsProps)._commentId !== undefined;
}
type type_announcementT = 'reacted to your comment.' | 'reacted to your post.' | null;
interface HandleReactionsProps {
  toUser: string;
  payload: PostReactionsProps | CommentsReactionsProps;
  type_announcement: type_announcementT;
}

function useHandleReactions({ initialsReactions }: { initialsReactions: TypeReactions | undefined }) {
  const [reaction, setReaction] = useState(initialsReactions || undefined);
  // const announcement = useDetailedAnnouncements();
  // console.log(announcement.data);
  const { debounce } = useDebounce();
  const { data } = useAuthentication({});
  // const { _name, _userId, avatar } = data;
  const DELAY_TIME = 1000;
  const reactionRef = useRef<PostReactionsProps | CommentsReactionsProps>();
  const handleReactions = ({
    payload,
    toUser,
    type_announcement,
    _postsId,
    fnDelete,
    fnCreate,
    fnUpdate,
    _toUserName,
  }: HandleReactionsProps &
    Pick<Posts, '_postsId'> & {
      fnDelete?: (payload: CommentsReactionsProps | PostReactionsProps) => void;
      fnCreate?: () => void;
      fnUpdate?: (props: {
        prev: CommentsReactionsProps | PostReactionsProps;
        newType: TypeReactions;
      }) => void;
      _toUserName: string;
    }) => {
    setReaction((prev) => {
      const type = payload._type;

      if (prev === type) {
        if (reactionRef.current) {
          payload._reactionId = reactionRef.current._reactionId;
        }
        Delete(payload, toUser);
        if (fnDelete) {
          fnDelete(payload);
        }
        return undefined;
      }
      if (TypeReactions[type] && prev && TypeReactions[prev]) {
        if (reactionRef.current) {
          payload._reactionId = reactionRef.current._reactionId;
        }
        if (fnUpdate) {
          fnUpdate({
            prev: {
              ...payload,
              _type: prev,
            },
            newType: type,
          });
        }
        Update(payload);
      } else {
        reactionRef.current = payload;

        Create(payload, type_announcement, _postsId, toUser, _postsId, _toUserName);
        if (fnCreate) {
          fnCreate();
        }
      }
      return type;
    });
  };
  const Create = (
    payload: PostReactionsProps | CommentsReactionsProps,
    _type: type_announcementT,
    _postsId: string,
    toUserId: string,
    _idLink: string,
    _toUserName: string
  ) => {
    debounce(() => {
      const instance = ActivityNotifications.getInstance();

      if (toUserId !== data?._userId) {
        const announcementPayload: AnnouncementProps = {
          _createAt: new Date(),
          _idAnnouncement: uuid(),
          _fromUser: data?._userId || '',
          _name: data?._name || '',
          avatar: data?.avatar || '',
          state: 0,
          _idOther: payload._reactionId,
          _idLink,
          _typeLink: TypeLink.Post,
          _type,
          _toUserName,
          _userId: toUserId,
        };

        instance.create({ payload: announcementPayload, toUserId });
      }

      if (isCommentsReactionsProps(payload)) {
        CreateCommentsReactions(payload);
      } else {
        CreatePostReactions(payload);
      }
    }, DELAY_TIME);
  };
  const Delete = (props: PostReactionsProps | CommentsReactionsProps, toUser: string) => {
    debounce(() => {
      if (isCommentsReactionsProps(props)) {
        DeleteCommentsReactions({ _reactionId: props._reactionId });
      } else {
        DeletePostReactions({ _reactionId: props._reactionId });
      }
      DeleteDetailedAnnouncementByIdOther({ userId: toUser, id: props._reactionId });
    }, DELAY_TIME);
  };
  const Update = (props: PostReactionsProps | CommentsReactionsProps) => {
    debounce(() => {
      if (isCommentsReactionsProps(props)) {
        UpdateCommentsReactions(props);
      } else {
        UpdatePostReactions(props);
      }
    }, DELAY_TIME);
  };

  return { handleReactions, reaction, setReaction };
}

export default useHandleReactions;
