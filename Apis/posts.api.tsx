import { FetchResponse } from '@Types/Comments/index';
import { PaginationI } from '@Types/pagination.type';
import { IEditPost } from '@Types/Post/ApiPost.type';
import { Posts, PostsProps, PostsReduce, UserPostPayload } from '@Types/Post/Post.type';
import { User } from '@Types/User/User.type';
import FetchData from 'Apis';

export async function GetPostsByUserId(
  id: string,
  viewerId: string,
  { limit, offset }: PaginationI
): Promise<FetchResponse<UserPostPayload>> {
  const res = await FetchData.get(`/api/posts/userName/${id}/${viewerId}/?offset=${offset}&limit=${limit}`);
  return await res.json();
}

export async function GetPostByPostId({
  _postsId,
  viewer_actor,
}: Pick<Posts, '_postsId'> & { viewer_actor: string }): Promise<FetchResponse<PostsReduce[]>> {
  const res = await FetchData.get(`/api/posts/${_postsId}/?viewer_actor=${viewer_actor}`);
  return await res.json();
}
export async function GetPosts({
  _userId,
  offset,
  limit,
}: Pick<User, '_userId'> & PaginationI): Promise<
  FetchResponse<{ posts: PostsProps[]; _numberOfPosts: number }>
> {
  const res = await FetchData.get(`/api/posts/?id=${_userId}&offset=${offset}&limit=${limit}`);
  return await res.json();
}
export async function CreatePosts(
  payload: Omit<PostsProps, 'currentComments' | 'type_reaction' | 'viewer_actor' | 'reactionId'>
): Promise<FetchResponse<[]>> {
  const res = await FetchData.post(`/api/posts/`, payload);
  return await res.json();
}
export async function DeletePosts(id: string) {
  const res = await FetchData.delete(`/api/posts/?id=${id}`);
  return await res.json();
}
export async function UpdatePost(payload: IEditPost) {
  const res = await FetchData.patch(`/api/posts/`, payload);
  return await res.json();
}
