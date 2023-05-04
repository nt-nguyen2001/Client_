import { CreatedCommentProps } from '@Types/Comments/Comments.api';
import { EditCommentProps, FetchResponse, IComment } from '@Types/Comments/index';
import { Posts } from '@Types/Post/Post.type';
import FetchData from 'Apis';

export async function createComment(payload: CreatedCommentProps): Promise<FetchResponse<unknown>> {
  const res = await FetchData.post(`/api/comments`, payload);
  return await res.json();
}
export async function getComments(postId: string, parentId?: string): Promise<FetchResponse<IComment[]>> {
  const res = await FetchData.get(`/api/comments/${postId}/${parentId}`);
  return await res.json();
}
export async function getTemporary({
  _postsId,
  offset = 0,
  _parentId = '',
  _userId,
}: Pick<IComment, '_parentId' | '_userId'> & Pick<Posts, '_postsId'> & { offset: number }): Promise<
  FetchResponse<IComment[]>
> {
  const res = await FetchData.get(
    `/api/comments/${_postsId}/?userId=${_userId}&offset=${offset}&parentId=${_parentId ?? ''}`
  );
  return await res.json();
}
export async function deleteComments(commentId: string, userId: string): Promise<FetchResponse<unknown>> {
  const res = await FetchData.delete(`/api/comments/${commentId}/?id=${userId}`);
  return await res.json();
}
export async function EditComments(
  payload: Omit<EditCommentProps, '_parentId'>
): Promise<FetchResponse<unknown>> {
  const res = await FetchData.patch(`/api/comments/${payload._commentId}`, payload);
  return await res.json();
}
