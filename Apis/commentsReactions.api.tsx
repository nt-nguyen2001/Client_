import { FetchResponse } from '@Types/Comments/index';
import { CommentsReactionsProps } from '@Types/Reactions';
import { ReactionsPayload, UpdateReactionsProps } from '@Types/Reactions/reactions.api';
import FetchData from 'Apis';

export async function GetCommentsReactions({
  _commentId,
}: Pick<CommentsReactionsProps, '_commentId'>): Promise<FetchResponse<ReactionsPayload>> {
  const res = await FetchData.get(`/api/reactions/comments/${_commentId}`);
  return await res.json();
}

export async function CreateCommentsReactions(
  payload: CommentsReactionsProps
): Promise<FetchResponse<unknown>> {
  const res = await FetchData.post(`/api/reactions/comments/`, payload);
  return await res.json();
}

export async function DeleteCommentsReactions({
  _reactionId,
}: Pick<CommentsReactionsProps, '_reactionId'>): Promise<FetchResponse<unknown>> {
  const res = await FetchData.delete(`/api/reactions/comments/${_reactionId}`);
  return await res.json();
}

export async function UpdateCommentsReactions({
  _reactionId,
  _type,
}: UpdateReactionsProps): Promise<FetchResponse<unknown>> {
  const res = await FetchData.patch(`/api/reactions/comments/${_reactionId}`, _type);
  return await res.json();
}
