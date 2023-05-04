import { FetchResponse } from '@Types/Comments/index';
import { PostReactionsProps } from '@Types/Reactions';
import { ReactionsPayload, UpdateReactionsProps } from '@Types/Reactions/reactions.api';
import FetchData from 'Apis';

export async function GetPostReactions({
  _postId,
}: Pick<PostReactionsProps, '_postId'>): Promise<FetchResponse<ReactionsPayload>> {
  const res = await FetchData.get(`/api/reactions/posts/${_postId}`);
  return await res.json();
}

export async function CreatePostReactions(payload: PostReactionsProps): Promise<FetchResponse<unknown>> {
  const res = await FetchData.post(`/api/reactions/posts/`, payload);
  return await res.json();
}

export async function DeletePostReactions({
  _reactionId,
}: Pick<PostReactionsProps, '_reactionId'>): Promise<FetchResponse<unknown>> {
  const res = await FetchData.delete(`/api/reactions/posts/${_reactionId}`);
  return await res.json();
}

export async function UpdatePostReactions({
  _reactionId,
  _type,
}: UpdateReactionsProps): Promise<FetchResponse<unknown>> {
  const res = await FetchData.patch(`/api/reactions/posts/${_reactionId}`, _type);
  return await res.json();
}
